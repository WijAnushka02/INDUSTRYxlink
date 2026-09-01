import express from 'express';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/requestController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('UNIVERSITY_COORDINATOR'), createRequest);
router.get('/', protect, getRequests);
router.put('/:id/status', protect, authorize('COMPANY_COORDINATOR'), updateRequestStatus);

export default router;
