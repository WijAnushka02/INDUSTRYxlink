import VisitOpportunity from '../models/VisitOpportunity';

class OpportunityService {
  public async createOpportunity(data: any) {
    return await VisitOpportunity.create(data);
  }

  public async getPaginatedOpportunities(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const count = await VisitOpportunity.countDocuments({ status: 'OPEN' });
    const opportunities = await VisitOpportunity.find({ status: 'OPEN' })
      .populate('companyId', 'name location')
      .skip(skip)
      .limit(limit);

    return {
      opportunities,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    };
  }

  public async getOpportunityById(id: string) {
    return await VisitOpportunity.findById(id).populate('companyId', 'name location website');
  }
}

export default new OpportunityService();
