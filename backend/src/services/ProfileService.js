"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const University_1 = __importDefault(require("../models/University"));
const Company_1 = __importDefault(require("../models/Company"));
class ProfileService {
    async createProfile(role, orgName) {
        if (role === 'UNIVERSITY_COORDINATOR') {
            const university = await University_1.default.create({ name: orgName, location: 'TBD' });
            return { universityId: university._id.toString() };
        }
        if (role === 'COMPANY_COORDINATOR') {
            const company = await Company_1.default.create({ name: orgName, location: 'TBD', website: '' });
            return { companyId: company._id.toString() };
        }
        return {};
    }
}
exports.default = new ProfileService();
//# sourceMappingURL=ProfileService.js.map