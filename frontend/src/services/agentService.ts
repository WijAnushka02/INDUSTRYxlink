/**
 * INDUSTRYxLINK – Agent API Service
 *
 * Frontend service for interacting with the agent pipeline endpoints.
 */

import { API_BASE_URL } from '../utils';
import type { PipelineResult, AgentSystemStatus, VisitReportData } from '../types';

const AGENT_API = `${API_BASE_URL}/api/v1/agents`;

/** Fetch options with credentials */
const fetchOptions: RequestInit = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};

/** Get the status of all agents */
export const getAgentStatus = async (): Promise<AgentSystemStatus> => {
  const res = await fetch(`${AGENT_API}/status`, fetchOptions);
  if (!res.ok) throw new Error('Failed to fetch agent status');
  return res.json();
};

/** Trigger the pre-visit pipeline */
export const triggerPreVisitPipeline = async (data: {
  studentCount: number;
  yearOfStudy?: number;
  degreeProgram: string;
  topicInterests: string[];
  preferredMonth?: string;
  preferredStartDate?: string;
  preferredEndDate?: string;
}): Promise<PipelineResult> => {
  const res = await fetch(`${AGENT_API}/pipeline/pre-visit`, {
    ...fetchOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to trigger pre-visit pipeline');
  return res.json();
};

/** Trigger the post-visit pipeline */
export const triggerPostVisitPipeline = async (data: {
  visitId: string;
  universityName: string;
  companyName: string;
  visitDate: string;
  registeredStudents: { studentId: string; studentName: string }[];
  attendeeList: { studentId: string; checkInTime?: string }[];
  coordinatorNotes?: string;
}): Promise<any> => {
  const res = await fetch(`${AGENT_API}/pipeline/post-visit`, {
    ...fetchOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to trigger post-visit pipeline');
  return res.json();
};

/** Schedule reminders for a visit */
export const scheduleReminders = async (data: {
  visitId: string;
  visitDate: string;
  companyName: string;
  universityName: string;
  studentEmails?: string[];
  companyEmail?: string;
}): Promise<any> => {
  const res = await fetch(`${AGENT_API}/reminders/schedule`, {
    ...fetchOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to schedule reminders');
  return res.json();
};

/** Get audit logs for a pipeline */
export const getAuditLogs = async (pipelineId: string): Promise<any> => {
  const res = await fetch(`${AGENT_API}/audit/${pipelineId}`, fetchOptions);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
};

/** Get a visit report */
export const getVisitReport = async (visitId: string): Promise<VisitReportData> => {
  const res = await fetch(`${AGENT_API}/reports/${visitId}`, fetchOptions);
  if (!res.ok) throw new Error('Failed to fetch visit report');
  return res.json();
};
