/**
 * INDUSTRYxLINK – Attendance Agent
 *
 * Processes the attendance list after the event.
 * Compares registered students against actual attendees.
 * Flags no-shows and late cancellations.
 * Records attendance statistics for analytics.
 */

import AttendanceRecord from '../models/AttendanceRecord';
import {
  IAgent,
  AgentResult,
  AgentLog,
  AttendanceEntry,
} from './types';

interface AttendanceInput {
  visitId: string;
  registeredStudents: { studentId: string; studentName: string }[];
  attendeeList: { studentId: string; checkInTime?: string }[];
}

interface AttendanceOutput {
  totalRegistered: number;
  totalAttended: number;
  totalNoShows: number;
  attendanceRate: number;
  entries: AttendanceEntry[];
  noShowList: { studentId: string; studentName: string }[];
}

class AttendanceAgent implements IAgent<AttendanceInput, AttendanceOutput> {
  public name = 'AttendanceAgent';

  public async execute(input: AttendanceInput): Promise<AgentResult<AttendanceOutput>> {
    const logs: AgentLog[] = [];

    logs.push({
      agentName: this.name,
      action: 'START_ATTENDANCE_PROCESSING',
      timestamp: new Date(),
      input: {
        visitId: input.visitId,
        registered: input.registeredStudents.length,
        attendees: input.attendeeList.length,
      },
      status: 'RUNNING',
    });

    try {
      const attendeeIds = new Set(input.attendeeList.map(a => a.studentId));
      const entries: AttendanceEntry[] = [];
      const noShowList: { studentId: string; studentName: string }[] = [];

      for (const student of input.registeredStudents) {
        const attended = attendeeIds.has(student.studentId);
        const attendee = input.attendeeList.find(a => a.studentId === student.studentId);

        const entry: AttendanceEntry = {
          studentId: student.studentId,
          studentName: student.studentName,
          present: attended,
          checkInTime: attendee?.checkInTime ? new Date(attendee.checkInTime) : undefined,
          notes: attended ? undefined : 'No-show',
        };

        entries.push(entry);

        if (!attended) {
          noShowList.push({ studentId: student.studentId, studentName: student.studentName });
        }
      }

      // Persist attendance records to the database
      const records = entries.map(entry => ({
        visitId: input.visitId,
        studentId: entry.studentId,
        present: entry.present,
        checkInTime: entry.checkInTime,
        notes: entry.notes,
      }));

      await AttendanceRecord.insertMany(records);

      const totalRegistered = input.registeredStudents.length;
      const totalAttended = entries.filter(e => e.present).length;
      const totalNoShows = noShowList.length;
      const attendanceRate = totalRegistered > 0
        ? Math.round((totalAttended / totalRegistered) * 100)
        : 0;

      logs.push({
        agentName: this.name,
        action: 'ATTENDANCE_PROCESSED',
        timestamp: new Date(),
        output: {
          totalRegistered,
          totalAttended,
          totalNoShows,
          attendanceRate: `${attendanceRate}%`,
        },
        status: 'COMPLETED',
      });

      // Flag high no-show rate
      if (attendanceRate < 70) {
        logs.push({
          agentName: this.name,
          action: 'HIGH_NO_SHOW_WARNING',
          timestamp: new Date(),
          output: `Warning: Attendance rate is ${attendanceRate}%, which is below the 70% threshold.`,
          status: 'COMPLETED',
        });
      }

      return {
        success: true,
        data: {
          totalRegistered,
          totalAttended,
          totalNoShows,
          attendanceRate,
          entries,
          noShowList,
        },
        logs,
      };
    } catch (error: any) {
      logs.push({
        agentName: this.name,
        action: 'ATTENDANCE_ERROR',
        timestamp: new Date(),
        status: 'FAILED',
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
        logs,
      };
    }
  }
}

export default new AttendanceAgent();
