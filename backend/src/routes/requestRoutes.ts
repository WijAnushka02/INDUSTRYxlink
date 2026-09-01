import express from 'express';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/requestController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createRequestSchema, updateRequestStatusSchema } from '../validators/request.validator';

const router = express.Router();

router.post('/', protect, authorize('UNIVERSITY_COORDINATOR'), validate(createRequestSchema), createRequest);
router.get('/', protect, getRequests);
router.put('/:id/status', protect, authorize('COMPANY_COORDINATOR'), validate(updateRequestStatusSchema), updateRequestStatus);

export default router;
