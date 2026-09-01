"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequestStatus = exports.getRequests = exports.createRequest = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const RequestService_1 = __importDefault(require("../services/RequestService"));
const OpportunityService_1 = __importDefault(require("../services/OpportunityService"));
exports.createRequest = (0, express_async_handler_1.default)(async (req, res) => {
    const { opportunityId, requestedDate, studentCount } = req.body;
    if (!req.user?.universityId) {
        res.status(403);
        throw new Error('Only universities can create requests');
    }
    const opportunity = await OpportunityService_1.default.getOpportunityById(opportunityId);
    if (!opportunity) {
        res.status(404);
        throw new Error('Opportunity not found');
    }
    const visitRequest = await RequestService_1.default.createRequest({
        universityId: req.user.universityId,
        companyId: opportunity.companyId,
        opportunityId,
        requestedDate,
        studentCount,
    });
    res.status(201).json(visitRequest);
});
exports.getRequests = (0, express_async_handler_1.default)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let query = {};
    if (req.user?.universityId) {
        query = { universityId: req.user.universityId };
    }
    else if (req.user?.companyId) {
        query = { companyId: req.user.companyId };
    }
    else {
        res.status(403);
        throw new Error('Not authorized');
    }
    const result = await RequestService_1.default.getPaginatedRequests(query, page, limit);
    res.json(result);
});
exports.updateRequestStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const { status } = req.body;
    if (!req.user?.companyId) {
        res.status(403);
        throw new Error('Only companies can update request status');
    }
    const visitRequest = await RequestService_1.default.updateRequestStatus(req.params.id, status);
    if (!visitRequest) {
        res.status(404);
        throw new Error('Request not found');
    }
    res.json(visitRequest);
});
//# sourceMappingURL=requestController.js.map