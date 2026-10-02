/**
 * INDUSTRYxLINK – Reminder Agent
 *
 * Sends timely reminders before the visit.
 * Schedules automated reminders at configurable intervals:
 *   - 1 week before, 3 days before, 1 day before
 * Handles visit postponement and cancellation notifications.
 * Triggers re-scheduling workflows when needed.
 */

import { Queue } from 'bullmq';
import { connection } from '../config/redis';
import {
  IAgent,
  AgentResult,
  AgentLog,
  ReminderSchedule,
} from './types';

interface ReminderInput {
  visitId: string;
  visitDate: string;
  companyName: string;
  universityName: string;
  coordinatorEmail: string;
  studentEmails?: string[];
  companyEmail?: string;
  type: 'SCHEDULE' | 'POSTPONEMENT' | 'CANCELLATION';
  newDate?: string;
}

interface ReminderOutput {
  scheduledReminders: ReminderSchedule[];
  totalScheduled: number;
}

class ReminderAgent implements IAgent<ReminderInput, ReminderOutput> {
  public name = 'ReminderAgent';
  private emailQueue: Queue;

  constructor() {
    this.emailQueue = new Queue('emailQueue', { connection });
  }

  public async execute(input: ReminderInput): Promise<AgentResult<ReminderOutput>> {
    const logs: AgentLog[] = [];
    const scheduledReminders: ReminderSchedule[] = [];

    logs.push({
      agentName: this.name,
      action: 'START_REMINDER_SCHEDULING',
      timestamp: new Date(),
      input: { visitId: input.visitId, type: input.type },
      status: 'RUNNING',
    });

    try {
      switch (input.type) {
        case 'SCHEDULE':
          await this.scheduleVisitReminders(input, scheduledReminders, logs);
          break;
        case 'POSTPONEMENT':
          await this.handlePostponement(input, logs);
          break;
        case 'CANCELLATION':
          await this.handleCancellation(input, logs);
          break;
      }

      logs.push({
        agentName: this.name,
        action: 'REMINDER_SCHEDULING_COMPLETE',
        timestamp: new Date(),
        output: { totalScheduled: scheduledReminders.length },
        status: 'COMPLETED',
      });

      return {
        success: true,
        data: { scheduledReminders, totalScheduled: scheduledReminders.length },
        logs,
      };
    } catch (error: any) {
      logs.push({
        agentName: this.name,
        action: 'REMINDER_ERROR',
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

  private async scheduleVisitReminders(
    input: ReminderInput,
    reminders: ReminderSchedule[],
    logs: AgentLog[]
  ): Promise<void> {
    const visitDate = new Date(input.visitDate);
    const allRecipients = [
      input.coordinatorEmail,
      ...(input.studentEmails || []),
    ];

    // 1 week before
    const oneWeekBefore = new Date(visitDate);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
    if (oneWeekBefore > new Date()) {
      reminders.push(this.createReminder(input, 'ONE_WEEK', oneWeekBefore, allRecipients));

      const delay = oneWeekBefore.getTime() - Date.now();
      await this.emailQueue.add('sendEmail', {
        to: input.coordinatorEmail,
        subject: `Reminder: Industry visit to ${input.companyName} in 1 week`,
        body: `Dear ${input.universityName} Coordinator,\n\nThis is a reminder that your industry visit to ${input.companyName} is scheduled for ${visitDate.toLocaleDateString()}.\n\nPlease ensure all students are informed and prepared.\n\nBest regards,\nINDUSTRYxLINK`,
      }, { delay });

      logs.push({
        agentName: this.name,
        action: 'SCHEDULED_1_WEEK_REMINDER',
        timestamp: new Date(),
        output: { scheduledFor: oneWeekBefore.toISOString() },
        status: 'COMPLETED',
      });
    }

    // 3 days before
    const threeDaysBefore = new Date(visitDate);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
    if (threeDaysBefore > new Date()) {
      reminders.push(this.createReminder(input, 'THREE_DAYS', threeDaysBefore, allRecipients));

      const delay = threeDaysBefore.getTime() - Date.now();
      await this.emailQueue.add('sendEmail', {
        to: input.coordinatorEmail,
        subject: `Reminder: Industry visit to ${input.companyName} in 3 days`,
        body: `Dear ${input.universityName} Coordinator,\n\nYour industry visit to ${input.companyName} is in 3 days (${visitDate.toLocaleDateString()}).\n\nPlease confirm transportation and share the visit agenda with students.\n\nBest regards,\nINDUSTRYxLINK`,
      }, { delay });

      logs.push({
        agentName: this.name,
        action: 'SCHEDULED_3_DAY_REMINDER',
        timestamp: new Date(),
        output: { scheduledFor: threeDaysBefore.toISOString() },
        status: 'COMPLETED',
      });
    }

    // 1 day before
    const oneDayBefore = new Date(visitDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    if (oneDayBefore > new Date()) {
      reminders.push(this.createReminder(input, 'ONE_DAY', oneDayBefore, allRecipients));

      const delay = oneDayBefore.getTime() - Date.now();
      await this.emailQueue.add('sendEmail', {
        to: input.coordinatorEmail,
        subject: `Tomorrow: Industry visit to ${input.companyName}`,
        body: `Dear ${input.universityName} Coordinator,\n\nYour industry visit to ${input.companyName} is TOMORROW (${visitDate.toLocaleDateString()}).\n\nFinal checklist:\n• Confirm student attendance\n• Verify transportation arrangements\n• Share company location and meeting point\n• Remind students of dress code and requirements\n\nBest regards,\nINDUSTRYxLINK`,
      }, { delay });

      logs.push({
        agentName: this.name,
        action: 'SCHEDULED_1_DAY_REMINDER',
        timestamp: new Date(),
        output: { scheduledFor: oneDayBefore.toISOString() },
        status: 'COMPLETED',
      });
    }

    // Send preparation details to the company
    if (input.companyEmail) {
      const companyDelay = oneDayBefore > new Date()
        ? oneDayBefore.getTime() - Date.now()
        : 0;

      await this.emailQueue.add('sendEmail', {
        to: input.companyEmail,
        subject: `Upcoming Visit: ${input.universityName} – ${visitDate.toLocaleDateString()}`,
        body: `Dear ${input.companyName} Engagement Team,\n\nThis is a reminder that ${input.universityName} will be visiting on ${visitDate.toLocaleDateString()}.\n\nExpected number of students: ${input.studentEmails?.length || 'TBD'}\n\nPlease ensure the necessary arrangements are in place.\n\nBest regards,\nINDUSTRYxLINK`,
      }, { delay: companyDelay });
    }
  }

  private async handlePostponement(input: ReminderInput, logs: AgentLog[]): Promise<void> {
    await this.emailQueue.add('sendEmail', {
      to: input.coordinatorEmail,
      subject: `Visit Postponed: ${input.companyName}`,
      body: `Dear ${input.universityName} Coordinator,\n\nThe industry visit to ${input.companyName} has been POSTPONED.\n\n${input.newDate ? `New proposed date: ${new Date(input.newDate).toLocaleDateString()}` : 'A new date will be communicated shortly.'}\n\nPlease take the following actions:\n• Inform registered students\n• Update transportation arrangements\n• Adjust your schedule accordingly\n\nBest regards,\nINDUSTRYxLINK`,
    });

    logs.push({
      agentName: this.name,
      action: 'POSTPONEMENT_NOTIFICATION_SENT',
      timestamp: new Date(),
      status: 'COMPLETED',
    });
  }

  private async handleCancellation(input: ReminderInput, logs: AgentLog[]): Promise<void> {
    await this.emailQueue.add('sendEmail', {
      to: input.coordinatorEmail,
      subject: `Visit Cancelled: ${input.companyName}`,
      body: `Dear ${input.universityName} Coordinator,\n\nWe regret to inform you that the industry visit to ${input.companyName} has been CANCELLED.\n\nPlease take the following actions:\n• Inform registered students immediately\n• Cancel transportation bookings\n• Update your schedule\n• Consider exploring alternative opportunities on INDUSTRYxLINK\n\nBest regards,\nINDUSTRYxLINK`,
    });

    logs.push({
      agentName: this.name,
      action: 'CANCELLATION_NOTIFICATION_SENT',
      timestamp: new Date(),
      status: 'COMPLETED',
    });
  }

  private createReminder(
    input: ReminderInput,
    type: ReminderSchedule['reminderType'],
    scheduledDate: Date,
    recipients: string[]
  ): ReminderSchedule {
    return {
      visitId: input.visitId,
      reminderType: type,
      scheduledDate,
      recipients,
      message: `Reminder for visit to ${input.companyName} on ${new Date(input.visitDate).toLocaleDateString()}`,
      status: 'SCHEDULED',
    };
  }
}

export default new ReminderAgent();
