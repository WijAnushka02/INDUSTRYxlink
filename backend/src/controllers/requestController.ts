import { Response } from 'express';
import VisitRequest from '../models/VisitRequest';
import { AuthRequest } from '../middleware/auth';

export const createRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { opportunityId, requestedDate, studentCount } = req.body;

    if (req.user?.profileModel !== 'University' || !req.user?.profileId) {
      res.status(403).json({ message: 'Only universities can create requests' });
      return;
    }

    const visitRequest = await VisitRequest.create({
      universityId: req.user.profileId,
      opportunityId,
      requestedDate,
      studentCount,
    });

    res.status(201).json(visitRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let requests;
    
    if (req.user?.profileModel === 'University') {
      requests = await VisitRequest.find({ universityId: req.user.profileId })
        .populate({ path: 'opportunityId', populate: { path: 'companyId', select: 'name' } });
    } else if (req.user?.profileModel === 'Company') {
      requests = await VisitRequest.find()
        .populate({ path: 'opportunityId', match: { companyId: req.user.profileId } })
        .populate('universityId', 'name location');
        
      // Filter out requests where opportunityId is null (due to match condition)
      requests = requests.filter(request => request.opportunityId !== null);
    } else {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    if (req.user?.profileModel !== 'Company') {
      res.status(403).json({ message: 'Only companies can update request status' });
      return;
    }

    const visitRequest = await VisitRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!visitRequest) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    res.json(visitRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
