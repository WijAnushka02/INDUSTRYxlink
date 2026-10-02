/**
 * INDUSTRYxLINK – Visit Request Agent
 *
 * Receives a visit request from a university coordinator.
 * Parses the request to extract key parameters:
 *   - Student count, year of study, degree programme
 *   - Topic interests, preferred dates
 * Validates against the university's academic calendar.
 * Passes structured requirements to the Company Matching Agent.
 */

import University from '../models/University';
import {
  IAgent,
  AgentResult,
  AgentLog,
  VisitRequirements,
} from './types';

export interface VisitRequestInput {
  universityId: string;
  coordinatorId: string;
  studentCount: number;
  yearOfStudy?: number;
  degreeProgram: string;
  topicInterests: string[];
  preferredMonth?: string;
  preferredStartDate?: string;
  preferredEndDate?: string;
}

class VisitRequestAgent implements IAgent<VisitRequestInput, VisitRequirements> {
  public name = 'VisitRequestAgent';

  public async execute(input: VisitRequestInput): Promise<AgentResult<VisitRequirements>> {
    const logs: AgentLog[] = [];
    const timestamp = new Date();

    logs.push({
      agentName: this.name,
      action: 'PARSE_REQUEST',
      timestamp,
      input,
      status: 'RUNNING',
    });

    try {
      // Validate the university exists
      const university = await University.findById(input.universityId);
      if (!university) {
        return {
          success: false,
          error: 'University not found',
          logs: [...logs, {
            agentName: this.name,
            action: 'VALIDATE_UNIVERSITY',
            timestamp: new Date(),
            status: 'FAILED',
            error: 'University not found',
          }],
        };
      }

      // Validate student count
      if (input.studentCount <= 0 || input.studentCount > 500) {
        return {
          success: false,
          error: 'Student count must be between 1 and 500',
          logs: [...logs, {
            agentName: this.name,
            action: 'VALIDATE_STUDENT_COUNT',
            timestamp: new Date(),
            status: 'FAILED',
            error: 'Invalid student count',
          }],
        };
      }

      // Check academic calendar conflicts
      const calendar = university.academicCalendar;
      if (calendar?.semesterEnd && input.preferredStartDate) {
        const preferredStart = new Date(input.preferredStartDate);
        const semesterEnd = new Date(calendar.semesterEnd);

        if (preferredStart < semesterEnd) {
          logs.push({
            agentName: this.name,
            action: 'CALENDAR_WARNING',
            timestamp: new Date(),
            status: 'COMPLETED',
            output: 'Preferred date falls within active semester. Proceeding with warning.',
          });
        }
      }

      // Build the structured requirements
      const requirements: VisitRequirements = {
        studentCount: input.studentCount,
        yearOfStudy: input.yearOfStudy,
        degreeProgram: input.degreeProgram,
        topicInterests: input.topicInterests,
        preferredMonth: input.preferredMonth,
        universityId: input.universityId,
        coordinatorId: input.coordinatorId,
      };

      if (input.preferredStartDate && input.preferredEndDate) {
        requirements.preferredDateRange = {
          start: new Date(input.preferredStartDate),
          end: new Date(input.preferredEndDate),
        };
      }

      logs.push({
        agentName: this.name,
        action: 'PARSE_REQUEST',
        timestamp: new Date(),
        output: requirements,
        status: 'COMPLETED',
      });

      return {
        success: true,
        data: requirements,
        logs,
      };
    } catch (error: any) {
      logs.push({
        agentName: this.name,
        action: 'PARSE_REQUEST',
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

export default new VisitRequestAgent();
