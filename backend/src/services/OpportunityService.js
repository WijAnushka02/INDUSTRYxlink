"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VisitOpportunity_1 = __importDefault(require("../models/VisitOpportunity"));
class OpportunityService {
    async createOpportunity(data) {
        return await VisitOpportunity_1.default.create(data);
    }
    async getPaginatedOpportunities(page, limit) {
        const skip = (page - 1) * limit;
        const count = await VisitOpportunity_1.default.countDocuments({ status: 'OPEN' });
        const opportunities = await VisitOpportunity_1.default.find({ status: 'OPEN' })
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
    async getOpportunityById(id) {
        return await VisitOpportunity_1.default.findById(id).populate('companyId', 'name location website');
    }
}
exports.default = new OpportunityService();
//# sourceMappingURL=OpportunityService.js.map