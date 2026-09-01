import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import VisitOpportunity from '../models/VisitOpportunity';
import User from '../models/User';
import VisitRequest from '../models/VisitRequest';

export const getPublicStats = asyncHandler(async (req: any, res: Response): Promise<void> => {
  // Aggregate basic public stats
  const totalOpportunities = await VisitOpportunity.countDocuments();
  const totalRequests = await VisitRequest.countDocuments();
  const totalUniversities = await User.countDocuments({ role: 'UNIVERSITY_COORDINATOR' });
  const totalCompanies = await User.countDocuments({ role: 'COMPANY_COORDINATOR' });

  res.json({
    totalOpportunities,
    totalRequests,
    totalUniversities,
    totalCompanies
  });
});
