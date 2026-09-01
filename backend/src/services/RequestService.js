"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VisitRequest_1 = __importDefault(require("../models/VisitRequest"));
class RequestService {
    async createRequest(data) {
        return await VisitRequest_1.default.create(data);
    }
    async getPaginatedRequests(query, page, limit) {
        const skip = (page - 1) * limit;
        const count = await VisitRequest_1.default.countDocuments(query);
        const requests = await VisitRequest_1.default.find(query)
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
    async updateRequestStatus(id, status) {
        const updatedRequest = await VisitRequest_1.default.findByIdAndUpdate(id, { status }, { new: true }).populate('universityId');
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
exports.default = new RequestService();
//# sourceMappingURL=RequestService.js.map