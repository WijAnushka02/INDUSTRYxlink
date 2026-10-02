/**
 * INDUSTRYxLINK – Agent Orchestrator
 *
 * Central orchestration layer that coordinates the execution of all
 * seven agents in the IFS Loops pipeline:
 *
 *   1. Visit Request Agent   → Parse coordinator request
 *   2. Company Matching Agent → Find suitable companies
 *   3. Capacity Agent         → Check seat availability
 *   4. Communication Agent    → Send emails
 *   5. Reminder Agent         → Schedule reminders
 *   6. Attendance Agent       → Process attendance (post-visit)
 *   7. Report Agent           → Generate report (post-visit)
 *
 * The orchestrator manages the full lifecycle and provides
 * a unified audit trail of all agent actions.
 */

import visitRequestAgent, { VisitRequestInput } from './visitRequestAgent';
import companyMatchingAgent from './companyMatchingAgent';
import capacityAgent from './capacityAgent';
import communicationAgent from './communicationAgent';
import reminderAgent from './reminderAgent';
import attendanceAgent from './attendanceAgent';
import reportAgent from './reportAgent';
import University from '../models/University';
import AgentAuditLog from '../models/AgentAuditLog';
import { AgentLog, CompanyMatch } from './types';

/** Full pipeline input from the coordinator */
export interface OrchestratorInput {
  universityId: string;
  coordinatorId: string;
  coordinatorEmail: string;
  studentCount: number;
  yearOfStudy?: number;
  degreeProgram: string;
  topicInterests: string[];
  preferredMonth?: string;
  preferredStartDate?: string;
  preferredEndDate?: string;
}

/** Full pipeline output */
export interface OrchestratorOutput {
  pipelineId: string;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED';
  matchedCompanies: CompanyMatch[];
  availableCompanies: CompanyMatch[];
  emailsSent: number;
  remindersScheduled: number;
  logs: AgentLog[];
  errors: string[];
}

class AgentOrchestrator {
  /**
   * Execute the full pre-visit pipeline (agents 1–5).
   * Agents 6 and 7 are triggered separately after the visit.
   */
  public async executePreVisitPipeline(input: OrchestratorInput): Promise<OrchestratorOutput> {
    const pipelineId = `pipeline_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const allLogs: AgentLog[] = [];
    const errors: string[] = [];
    let matchedCompanies: CompanyMatch[] = [];
    let availableCompanies: CompanyMatch[] = [];
    let emailsSent = 0;
    let remindersScheduled = 0;

    try {
      // ── Step 1: Visit Request Agent ──
      const visitRequestInput: VisitRequestInput = {
        universityId: input.universityId,
        coordinatorId: input.coordinatorId,
        studentCount: input.studentCount,
        yearOfStudy: input.yearOfStudy,
        degreeProgram: input.degreeProgram,
        topicInterests: input.topicInterests,
        preferredMonth: input.preferredMonth,
        preferredStartDate: input.preferredStartDate,
        preferredEndDate: input.preferredEndDate,
      };

      const visitResult = await visitRequestAgent.execute(visitRequestInput);
      allLogs.push(...visitResult.logs);

      if (!visitResult.success || !visitResult.data) {
        errors.push(`Visit Request Agent failed: ${visitResult.error}`);
        await this.persistAuditLogs(pipelineId, allLogs);
        return { pipelineId, status: 'FAILED', matchedCompanies, availableCompanies, emailsSent, remindersScheduled, logs: allLogs, errors };
      }

      const requirements = visitResult.data;

      // ── Step 2: Company Matching Agent ──
      const matchResult = await companyMatchingAgent.execute(requirements);
      allLogs.push(...matchResult.logs);

      if (!matchResult.success || !matchResult.data) {
        errors.push(`Company Matching Agent failed: ${matchResult.error}`);
        await this.persistAuditLogs(pipelineId, allLogs);
        return { pipelineId, status: 'FAILED', matchedCompanies, availableCompanies, emailsSent, remindersScheduled, logs: allLogs, errors };
      }

      matchedCompanies = matchResult.data;

      if (matchedCompanies.length === 0) {
        errors.push('No matching companies found for the given requirements.');
        await this.persistAuditLogs(pipelineId, allLogs);
        return { pipelineId, status: 'PARTIAL', matchedCompanies, availableCompanies, emailsSent, remindersScheduled, logs: allLogs, errors };
      }

      // ── Step 3: Capacity Agent ──
      const capacityResult = await capacityAgent.execute({
        matches: matchedCompanies,
        requiredSeats: input.studentCount,
      });
      allLogs.push(...capacityResult.logs);

      if (!capacityResult.success || !capacityResult.data) {
        errors.push(`Capacity Agent failed: ${capacityResult.error}`);
        await this.persistAuditLogs(pipelineId, allLogs);
        return { pipelineId, status: 'PARTIAL', matchedCompanies, availableCompanies, emailsSent, remindersScheduled, logs: allLogs, errors };
      }

      availableCompanies = capacityResult.data.availableMatches;

      if (availableCompanies.length === 0) {
        errors.push('No companies with sufficient capacity found.');
        await this.persistAuditLogs(pipelineId, allLogs);
        return { pipelineId, status: 'PARTIAL', matchedCompanies, availableCompanies, emailsSent, remindersScheduled, logs: allLogs, errors };
      }

      // ── Step 4: Communication Agent ──
      const university = await University.findById(input.universityId);
      const universityName = university?.name || 'University';

      const commResult = await communicationAgent.execute({
        type: 'VISIT_REQUEST',
        matches: availableCompanies,
        universityName,
        coordinatorEmail: input.coordinatorEmail,
        studentCount: input.studentCount,
        degreeProgram: input.degreeProgram,
        topicInterests: input.topicInterests,
      });
      allLogs.push(...commResult.logs);

      if (commResult.success && commResult.data) {
        emailsSent = commResult.data.emailsSent;
      } else {
        errors.push(`Communication Agent warning: ${commResult.error}`);
      }

      // ── Step 5: Reminder Agent (for each available company) ──
      // Reminders will be scheduled when a visit is confirmed.
      // At this stage, we log that the Reminder Agent is standing by.
      allLogs.push({
        agentName: 'ReminderAgent',
        action: 'STANDBY',
        timestamp: new Date(),
        output: 'Reminder Agent is standing by. Reminders will be scheduled upon visit confirmation.',
        status: 'COMPLETED',
      });

      await this.persistAuditLogs(pipelineId, allLogs);

      return {
        pipelineId,
        status: errors.length > 0 ? 'PARTIAL' : 'COMPLETED',
        matchedCompanies,
        availableCompanies,
        emailsSent,
        remindersScheduled,
        logs: allLogs,
        errors,
      };
    } catch (error: any) {
      allLogs.push({
        agentName: 'Orchestrator',
        action: 'PIPELINE_ERROR',
        timestamp: new Date(),
        status: 'FAILED',
        error: error.message,
      });

      await this.persistAuditLogs(pipelineId, allLogs);

      return {
        pipelineId,
        status: 'FAILED',
        matchedCompanies,
        availableCompanies,
        emailsSent,
        remindersScheduled,
        logs: allLogs,
        errors: [...errors, error.message],
      };
    }
  }

  /**
   * Execute the post-visit pipeline (agents 6–7).
   * Called after the visit has taken place.
   */
  public async executePostVisitPipeline(input: {
    visitId: string;
    universityName: string;
    companyName: string;
    visitDate: string;
    registeredStudents: { studentId: string; studentName: string }[];
    attendeeList: { studentId: string; checkInTime?: string }[];
    coordinatorNotes?: string;
  }) {
    const pipelineId = `post_visit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const allLogs: AgentLog[] = [];
    const errors: string[] = [];

    try {
      // ── Step 6: Attendance Agent ──
      const attendanceResult = await attendanceAgent.execute({
        visitId: input.visitId,
        registeredStudents: input.registeredStudents,
        attendeeList: input.attendeeList,
      });
      allLogs.push(...attendanceResult.logs);

      if (!attendanceResult.success) {
        errors.push(`Attendance Agent failed: ${attendanceResult.error}`);
      }

      // ── Step 7: Report Agent ──
      const reportResult = await reportAgent.execute({
        visitId: input.visitId,
        universityName: input.universityName,
        companyName: input.companyName,
        visitDate: input.visitDate,
        coordinatorNotes: input.coordinatorNotes,
      });
      allLogs.push(...reportResult.logs);

      if (!reportResult.success) {
        errors.push(`Report Agent failed: ${reportResult.error}`);
      }

      await this.persistAuditLogs(pipelineId, allLogs);

      return {
        pipelineId,
        status: errors.length > 0 ? 'PARTIAL' : 'COMPLETED',
        attendance: attendanceResult.data,
        report: reportResult.data,
        logs: allLogs,
        errors,
      };
    } catch (error: any) {
      allLogs.push({
        agentName: 'Orchestrator',
        action: 'POST_VISIT_ERROR',
        timestamp: new Date(),
        status: 'FAILED',
        error: error.message,
      });

      await this.persistAuditLogs(pipelineId, allLogs);

      return {
        pipelineId,
        status: 'FAILED',
        attendance: null,
        report: null,
        logs: allLogs,
        errors: [...errors, error.message],
      };
    }
  }

  /**
   * Schedule reminders for a confirmed visit.
   */
  public async scheduleVisitReminders(input: {
    visitId: string;
    visitDate: string;
    companyName: string;
    universityName: string;
    coordinatorEmail: string;
    studentEmails?: string[];
    companyEmail?: string;
  }) {
    return await reminderAgent.execute({
      ...input,
      type: 'SCHEDULE',
    });
  }

  /**
   * Persist all agent logs for audit trail.
   */
  private async persistAuditLogs(pipelineId: string, logs: AgentLog[]): Promise<void> {
    try {
      const auditEntries = logs.map(log => ({
        pipelineId,
        agentName: log.agentName,
        action: log.action,
        timestamp: log.timestamp,
        status: log.status,
        input: log.input ? JSON.stringify(log.input) : undefined,
        output: log.output ? JSON.stringify(log.output) : undefined,
        error: log.error,
      }));

      await AgentAuditLog.insertMany(auditEntries);
    } catch (err) {
      console.error('[Orchestrator] Failed to persist audit logs:', err);
    }
  }
}

export default new AgentOrchestrator();
