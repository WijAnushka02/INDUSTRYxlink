import { Response } from 'express';
import VisitOpportunity from '../models/VisitOpportunity';
import { AuthRequest } from '../middleware/auth';

export const createOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { visitDate, durationHours, capacity, topic, eligibleDegrees } = req.body;

    if (req.user?.profileModel !== 'Company' || !req.user?.profileId) {
      res.status(403).json({ message: 'Only companies can create opportunities' });
      return;
    }

    const opportunity = await VisitOpportunity.create({
      companyId: req.user.profileId,
      visitDate,
      durationHours,
      capacity,
      topic,
      eligibleDegrees,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getOpportunities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Basic filtering can be added here
    const opportunities = await VisitOpportunity.find({ status: 'OPEN' }).populate('companyId', 'name location');
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getOpportunityById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const opportunity = await VisitOpportunity.findById(req.params.id).populate('companyId', 'name location website');
    
    if (!opportunity) {
      res.status(404).json({ message: 'Opportunity not found' });
      return;
    }
    
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
