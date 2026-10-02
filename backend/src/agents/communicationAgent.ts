/**
 * INDUSTRYxLINK – Communication Agent
 *
 * Generates and sends emails to companies and students.
 * Handles:
 *   - Visit request emails to companies
 *   - Confirmation and registration links to students
 *   - Acceptance/rejection responses
 *   - Follow-up communication for pending requests
 */

import { Queue } from 'bullmq';
import { connection } from '../config/redis';
import {
  IAgent,
  AgentResult,
  AgentLog,
  CommunicationTask,
  CompanyMatch,
} from './types';

interface CommunicationInput {
  type: CommunicationTask['type'];
  matches?: CompanyMatch[];
  universityName: string;
  coordinatorEmail: string;
  studentCount: number;
  degreeProgram: string;
  topicInterests: string[];
  visitDate?: string;
  customRecipients?: { email: string; name: string }[];
}

interface CommunicationOutput {
  emailsSent: number;
  tasks: CommunicationTask[];
}

class CommunicationAgent implements IAgent<CommunicationInput, CommunicationOutput> {
  public name = 'CommunicationAgent';
  private emailQueue: Queue;

  constructor() {
    this.emailQueue = new Queue('emailQueue', { connection });
  }

  public async execute(input: CommunicationInput): Promise<AgentResult<CommunicationOutput>> {
    const logs: AgentLog[] = [];
    const tasks: CommunicationTask[] = [];

    logs.push({
      agentName: this.name,
      action: 'START_COMMUNICATION',
      timestamp: new Date(),
      input: { type: input.type, matchCount: input.matches?.length || 0 },
      status: 'RUNNING',
    });

    try {
      switch (input.type) {
        case 'VISIT_REQUEST':
          await this.handleVisitRequests(input, tasks, logs);
          break;
        case 'CONFIRMATION':
          await this.handleConfirmation(input, tasks, logs);
          break;
        case 'REJECTION':
          await this.handleRejection(input, tasks, logs);
          break;
        case 'REGISTRATION':
          await this.handleRegistration(input, tasks, logs);
          break;
        case 'FOLLOW_UP':
          await this.handleFollowUp(input, tasks, logs);
          break;
      }

      // Dispatch all tasks to the email queue
      for (const task of tasks) {
        await this.emailQueue.add('sendEmail', {
          to: task.recipientEmail,
          subject: task.subject,
          body: task.body,
        });
      }

      logs.push({
        agentName: this.name,
        action: 'COMMUNICATION_COMPLETE',
        timestamp: new Date(),
        output: { emailsSent: tasks.length },
        status: 'COMPLETED',
      });

      return {
        success: true,
        data: { emailsSent: tasks.length, tasks },
        logs,
      };
    } catch (error: any) {
      logs.push({
        agentName: this.name,
        action: 'COMMUNICATION_ERROR',
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

  private async handleVisitRequests(
    input: CommunicationInput,
    tasks: CommunicationTask[],
    logs: AgentLog[]
  ): Promise<void> {
    if (!input.matches) return;

    for (const match of input.matches) {
      const task: CommunicationTask = {
        type: 'VISIT_REQUEST',
        recipientType: 'COMPANY',
        recipientEmail: `engagement@${match.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        subject: `Industry Visit Request from ${input.universityName}`,
        body: this.generateVisitRequestEmail(input, match),
      };

      tasks.push(task);

      logs.push({
        agentName: this.name,
        action: 'EMAIL_GENERATED',
        timestamp: new Date(),
        output: { recipient: match.companyName, type: 'VISIT_REQUEST' },
        status: 'COMPLETED',
      });
    }
  }

  private async handleConfirmation(
    input: CommunicationInput,
    tasks: CommunicationTask[],
    logs: AgentLog[]
  ): Promise<void> {
    const task: CommunicationTask = {
      type: 'CONFIRMATION',
      recipientType: 'COORDINATOR',
      recipientEmail: input.coordinatorEmail,
      subject: 'Visit Request Confirmed – INDUSTRYxLINK',
      body: `Dear Coordinator,\n\nYour industry visit request for ${input.studentCount} ${input.degreeProgram} students has been confirmed.\n\nVisit Date: ${input.visitDate || 'TBD'}\nTopics: ${input.topicInterests.join(', ')}\n\nPlease log in to INDUSTRYxLINK to view full details and manage student registrations.\n\nBest regards,\nINDUSTRYxLINK Automated System`,
    };

    tasks.push(task);
    logs.push({
      agentName: this.name,
      action: 'CONFIRMATION_SENT',
      timestamp: new Date(),
      status: 'COMPLETED',
    });
  }

  private async handleRejection(
    input: CommunicationInput,
    tasks: CommunicationTask[],
    logs: AgentLog[]
  ): Promise<void> {
    const task: CommunicationTask = {
      type: 'REJECTION',
      recipientType: 'COORDINATOR',
      recipientEmail: input.coordinatorEmail,
      subject: 'Visit Request Update – INDUSTRYxLINK',
      body: `Dear Coordinator,\n\nUnfortunately, your industry visit request could not be accommodated at this time.\n\nWe recommend exploring other available opportunities on INDUSTRYxLINK.\n\nBest regards,\nINDUSTRYxLINK Automated System`,
    };

    tasks.push(task);
    logs.push({
      agentName: this.name,
      action: 'REJECTION_SENT',
      timestamp: new Date(),
      status: 'COMPLETED',
    });
  }

  private async handleRegistration(
    input: CommunicationInput,
    tasks: CommunicationTask[],
    logs: AgentLog[]
  ): Promise<void> {
    if (!input.customRecipients) return;

    for (const recipient of input.customRecipients) {
      const task: CommunicationTask = {
        type: 'REGISTRATION',
        recipientType: 'STUDENT',
        recipientEmail: recipient.email,
        subject: `Industry Visit Registration – ${input.topicInterests.join(', ')}`,
        body: `Dear ${recipient.name},\n\nYou have been registered for an upcoming industry visit.\n\nDate: ${input.visitDate || 'TBD'}\nTopics: ${input.topicInterests.join(', ')}\nDegree Programme: ${input.degreeProgram}\n\nPlease confirm your attendance via INDUSTRYxLINK.\n\nBest regards,\nINDUSTRYxLINK`,
      };

      tasks.push(task);
    }

    logs.push({
      agentName: this.name,
      action: 'REGISTRATIONS_SENT',
      timestamp: new Date(),
      output: { count: input.customRecipients.length },
      status: 'COMPLETED',
    });
  }

  private async handleFollowUp(
    input: CommunicationInput,
    tasks: CommunicationTask[],
    logs: AgentLog[]
  ): Promise<void> {
    if (!input.matches) return;

    for (const match of input.matches) {
      const task: CommunicationTask = {
        type: 'FOLLOW_UP',
        recipientType: 'COMPANY',
        recipientEmail: `engagement@${match.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        subject: `Follow-up: Industry Visit Request from ${input.universityName}`,
        body: `Dear ${match.companyName} Engagement Team,\n\nWe are following up on our industry visit request submitted for ${input.studentCount} ${input.degreeProgram} students.\n\nWe would appreciate a response at your earliest convenience.\n\nBest regards,\n${input.universityName}`,
      };

      tasks.push(task);
    }

    logs.push({
      agentName: this.name,
      action: 'FOLLOW_UPS_SENT',
      timestamp: new Date(),
      output: { count: input.matches.length },
      status: 'COMPLETED',
    });
  }

  private generateVisitRequestEmail(input: CommunicationInput, match: CompanyMatch): string {
    return [
      `Dear ${match.companyName} University Engagement Team,`,
      '',
      `We are writing from ${input.universityName} to request an industry visit for our students.`,
      '',
      'Visit Details:',
      `  • Number of Students: ${input.studentCount}`,
      `  • Degree Programme: ${input.degreeProgram}`,
      `  • Topics of Interest: ${input.topicInterests.join(', ')}`,
      `  • Preferred Date: ${input.visitDate || 'Flexible'}`,
      '',
      `Your organisation was matched with a suitability score of ${match.suitabilityScore}% based on our compatibility analysis.`,
      '',
      'We would be grateful if you could confirm your availability.',
      '',
      'Please respond via INDUSTRYxLINK or reply to this email.',
      '',
      'Best regards,',
      input.universityName,
      'via INDUSTRYxLINK Automated System',
    ].join('\n');
  }
}

export default new CommunicationAgent();
