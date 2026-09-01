import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import OpportunityService from '../services/OpportunityService';
import { AuthRequest } from '../middleware/auth';

export const createOpportunity = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { visitDate, durationHours, capacity, topic, eligibleDegrees } = req.body;

  if (!req.user?.companyId) {
    res.status(403);
    throw new Error('Only companies can create opportunities');
  }

  const opportunity = await OpportunityService.createOpportunity({
    companyId: req.user.companyId,
    visitDate,
    durationHours,
    capacity,
    topic,
    eligibleDegrees,
  });

  res.status(201).json(opportunity);
});

export const getOpportunities = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await OpportunityService.getPaginatedOpportunities(page, limit);
  res.json(result);
});

export const getOpportunityById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const opportunity = await OpportunityService.getOpportunityById(req.params.id as string);
  
  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }
  
  res.json(opportunity);
});

export const getPublicOpportunities = asyncHandler(async (req: any, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // Uses the same service method but this endpoint bypasses the protect middleware
  const result = await OpportunityService.getPaginatedOpportunities(page, limit);
  res.json(result);
});
