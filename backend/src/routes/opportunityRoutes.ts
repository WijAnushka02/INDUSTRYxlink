import express from 'express';
import { createOpportunity, getOpportunities, getOpportunityById } from '../controllers/opportunityController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('COMPANY_COORDINATOR'), createOpportunity);
router.get('/', protect, getOpportunities);
router.get('/:id', protect, getOpportunityById);

export default router;
