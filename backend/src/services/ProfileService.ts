import University from '../models/University';
import Company from '../models/Company';

interface ProfileIds {
  universityId?: string;
  companyId?: string;
}

class ProfileService {
  public async createProfile(role: string, orgName: string): Promise<ProfileIds> {
    if (role === 'UNIVERSITY_COORDINATOR') {
      const university = await University.create({ name: orgName, location: 'TBD' });
      return { universityId: university._id.toString() };
    } 
    
    if (role === 'COMPANY_COORDINATOR') {
      const company = await Company.create({ name: orgName, location: 'TBD', website: '' });
      return { companyId: company._id.toString() };
    }
    
    return {};
  }
}

export default new ProfileService();
