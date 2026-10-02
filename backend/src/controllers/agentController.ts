/**
 * INDUSTRYxLINK – Agent Controller
 *
 * REST API endpoints for triggering agent pipelines.
 */

import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middleware/auth';
import orchestrator from '../agents/orchestrator';
import AgentAuditLog from '../models/AgentAuditLog';
import VisitReport from '../models/VisitReport';

/**
 * POST /api/v1/agents/pipeline/pre-visit
 * Trigger the pre-visit pipeline (agents 1–5).
 * Requires: UNIVERSITY_COORDINATOR role.
 */
export const triggerPreVisitPipeline = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user?.universityId) {
    res.status(403);
    throw new Error('Only university coordinators can trigger the pre-visit pipeline');
  }

  const {
    studentCount,
    yearOfStudy,
    degreeProgram,
    topicInterests,
    preferredMonth,
    preferredStartDate,
    preferredEndDate,
  } = req.body;

  const result = await orchestrator.executePreVisitPipeline({
    universityId: req.user.universityId.toString(),
    coordinatorId: req.user._id.toString(),
    coordinatorEmail: req.user.email,
    studentCount,
    yearOfStudy,
    degreeProgram,
    topicInterests,
    preferredMonth,
    preferredStartDate,
    preferredEndDate,
  });

  const statusCode = result.status === 'FAILED' ? 500 : result.status === 'PARTIAL' ? 207 : 200;
  res.status(statusCode).json(result);
});

/**
 * POST /api/v1/agents/pipeline/post-visit
 * Trigger the post-visit pipeline (agents 6–7).
 * Requires: UNIVERSITY_COORDINATOR role.
 */
export const triggerPostVisitPipeline = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user?.universityId) {
    res.status(403);
    throw new Error('Only university coordinators can trigger the post-visit pipeline');
  }

  const {
    visitId,
    universityName,
    companyName,
    visitDate,
    registeredStudents,
    attendeeList,
    coordinatorNotes,
  } = req.body;

  const result = await orchestrator.executePostVisitPipeline({
    visitId,
    universityName,
    companyName,
    visitDate,
    registeredStudents,
    attendeeList,
    coordinatorNotes,
  });

  const statusCode = result.status === 'FAILED' ? 500 : result.status === 'PARTIAL' ? 207 : 200;
  res.status(statusCode).json(result);
});

/**
 * POST /api/v1/agents/reminders/schedule
 * Schedule reminders for a confirmed visit.
 * Requires: UNIVERSITY_COORDINATOR role.
 */
export const scheduleReminders = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user?.universityId) {
    res.status(403);
    throw new Error('Only university coordinators can schedule reminders');
  }

  const {
    visitId,
    visitDate,
    companyName,
    universityName,
    studentEmails,
    companyEmail,
  } = req.body;

  const result = await orchestrator.scheduleVisitReminders({
    visitId,
    visitDate,
    companyName,
    universityName,
    coordinatorEmail: req.user.email,
    studentEmails,
    companyEmail,
  });

  res.json(result);
});

/**
 * GET /api/v1/agents/audit/:pipelineId
 * Retrieve audit logs for a specific pipeline.
 */
export const getAuditLogs = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { pipelineId } = req.params;

  const logs = await AgentAuditLog.find({ pipelineId })
    .sort({ timestamp: 1 });

  res.json({ pipelineId, logs });
});

/**
 * GET /api/v1/agents/reports/:visitId
 * Retrieve the generated report for a specific visit.
 */
export const getVisitReport = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const report = await VisitReport.findOne({ visitId: req.params.visitId });

  if (!report) {
    res.status(404);
    throw new Error('Report not found for this visit');
  }

  res.json(report);
});

/**
 * GET /api/v1/agents/status
 * Get the status/health of all agents.
 */
export const getAgentStatus = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const agents = [
    { name: 'VisitRequestAgent', status: 'READY', description: 'Parses and validates coordinator visit requests' },
    { name: 'CompanyMatchingAgent', status: 'READY', description: 'Matches companies by degree, topic, capacity, and history' },
    { name: 'CapacityAgent', status: 'READY', description: 'Checks real-time seat availability at companies' },
    { name: 'CommunicationAgent', status: 'READY', description: 'Generates and sends automated emails' },
    { name: 'ReminderAgent', status: 'READY', description: 'Schedules and sends visit reminders' },
    { name: 'AttendanceAgent', status: 'READY', description: 'Processes post-visit attendance records' },
    { name: 'ReportAgent', status: 'READY', description: 'Generates comprehensive visit reports' },
  ];

  // Count recent pipeline executions
  const recentPipelines = await AgentAuditLog.distinct('pipelineId', {
    timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  res.json({
    agents,
    totalAgents: agents.length,
    recentPipelines: recentPipelines.length,
    systemStatus: 'OPERATIONAL',
  });
});
