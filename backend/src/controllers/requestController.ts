import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import RequestService from '../services/RequestService';
import OpportunityService from '../services/OpportunityService';
import { AuthRequest } from '../middleware/auth';

export const createRequest = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { opportunityId, requestedDate, studentCount } = req.body;

  if (!req.user?.universityId) {
    res.status(403);
    throw new Error('Only universities can create requests');
  }

  const opportunity = await OpportunityService.getOpportunityById(opportunityId);
  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }

  const visitRequest = await RequestService.createRequest({
    universityId: req.user.universityId,
    companyId: opportunity.companyId,
    opportunityId,
    requestedDate,
    studentCount,
  });

  res.status(201).json(visitRequest);
});

export const getRequests = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  let query: any = {};
  
  if (req.user?.universityId) {
    query = { universityId: req.user.universityId };
  } else if (req.user?.companyId) {
    query = { companyId: req.user.companyId };
  } else {
    res.status(403);
    throw new Error('Not authorized');
  }

  const result = await RequestService.getPaginatedRequests(query, page, limit);
  res.json(result);
});

export const updateRequestStatus = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  
  if (!req.user?.companyId) {
    res.status(403);
    throw new Error('Only companies can update request status');
  }

  const visitRequest = await RequestService.updateRequestStatus(req.params.id as string, status);

  if (!visitRequest) {
    res.status(404);
    throw new Error('Request not found');
  }

  res.json(visitRequest);
});
