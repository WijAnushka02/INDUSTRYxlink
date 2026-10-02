import express from 'express';
import {
  triggerPreVisitPipeline,
  triggerPostVisitPipeline,
  scheduleReminders,
  getAuditLogs,
  getVisitReport,
  getAgentStatus,
} from '../controllers/agentController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  preVisitPipelineSchema,
  postVisitPipelineSchema,
  scheduleRemindersSchema,
} from '../validators/agent.validator';

const router = express.Router();

// Agent status (accessible to all authenticated users)
router.get('/status', protect, getAgentStatus);

// Pre-visit pipeline (university coordinators only)
router.post(
  '/pipeline/pre-visit',
  protect,
  authorize('UNIVERSITY_COORDINATOR'),
  validate(preVisitPipelineSchema),
  triggerPreVisitPipeline
);

// Post-visit pipeline (university coordinators only)
router.post(
  '/pipeline/post-visit',
  protect,
  authorize('UNIVERSITY_COORDINATOR'),
  validate(postVisitPipelineSchema),
  triggerPostVisitPipeline
);

// Schedule reminders (university coordinators only)
router.post(
  '/reminders/schedule',
  protect,
  authorize('UNIVERSITY_COORDINATOR'),
  validate(scheduleRemindersSchema),
  scheduleReminders
);

// Audit logs (authenticated users)
router.get('/audit/:pipelineId', protect, getAuditLogs);

// Visit reports (authenticated users)
router.get('/reports/:visitId', protect, getVisitReport);

export default router;
