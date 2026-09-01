import express from 'express';
import { createOpportunity, getOpportunities, getOpportunityById } from '../controllers/opportunityController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOpportunitySchema } from '../validators/opportunity.validator';

const router = express.Router();

router.post('/', protect, authorize('COMPANY_COORDINATOR'), validate(createOpportunitySchema), createOpportunity);
router.get('/', protect, getOpportunities);
router.get('/:id', protect, getOpportunityById);

export default router;

export default router;
