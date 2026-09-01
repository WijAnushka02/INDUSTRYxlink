"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicOpportunities = exports.getOpportunityById = exports.getOpportunities = exports.createOpportunity = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const OpportunityService_1 = __importDefault(require("../services/OpportunityService"));
exports.createOpportunity = (0, express_async_handler_1.default)(async (req, res) => {
    const { visitDate, durationHours, capacity, topic, eligibleDegrees } = req.body;
    if (!req.user?.companyId) {
        res.status(403);
        throw new Error('Only companies can create opportunities');
    }
    const opportunity = await OpportunityService_1.default.createOpportunity({
        companyId: req.user.companyId,
        visitDate,
        durationHours,
        capacity,
        topic,
        eligibleDegrees,
    });
    res.status(201).json(opportunity);
});
exports.getOpportunities = (0, express_async_handler_1.default)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await OpportunityService_1.default.getPaginatedOpportunities(page, limit);
    res.json(result);
});
exports.getOpportunityById = (0, express_async_handler_1.default)(async (req, res) => {
    const opportunity = await OpportunityService_1.default.getOpportunityById(req.params.id);
    if (!opportunity) {
        res.status(404);
        throw new Error('Opportunity not found');
    }
    res.json(opportunity);
});
exports.getPublicOpportunities = (0, express_async_handler_1.default)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Uses the same service method but this endpoint bypasses the protect middleware
    const result = await OpportunityService_1.default.getPaginatedOpportunities(page, limit);
    res.json(result);
});
//# sourceMappingURL=opportunityController.js.map