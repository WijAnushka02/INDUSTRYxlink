import VisitRequest from '../models/VisitRequest';

class RequestService {
  public async createRequest(data: any) {
    return await VisitRequest.create(data);
  }

  public async getPaginatedRequests(query: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const count = await VisitRequest.countDocuments(query);
    const requests = await VisitRequest.find(query)
      .populate({ path: 'opportunityId', populate: { path: 'companyId', select: 'name' } })
      .populate('universityId', 'name location')
      .skip(skip)
      .limit(limit);

    return {
      requests,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    };
  }

  public async updateRequestStatus(id: string, status: string) {
    const updatedRequest = await VisitRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('universityId');

    // Dispatch background email job (Non-blocking)
    if (updatedRequest) {
      const Queue = require('bullmq').Queue;
      const connection = require('../config/redis').connection;
      const emailQueue = new Queue('emailQueue', { connection });

      const emailSubject = status === 'ACCEPTED' ? 'Visit Request Approved!' : 'Visit Request Update';
      
      await emailQueue.add('sendEmail', {
        to: 'university_contact@example.com', // Would normally pull from universityId.email
        subject: emailSubject,
        body: `Your visit request for opportunity has been marked as ${status}.`
      });
    }

    return updatedRequest;
  }
}

export default new RequestService();
