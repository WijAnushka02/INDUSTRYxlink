"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicStats = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const VisitOpportunity_1 = __importDefault(require("../models/VisitOpportunity"));
const User_1 = __importDefault(require("../models/User"));
const VisitRequest_1 = __importDefault(require("../models/VisitRequest"));
exports.getPublicStats = (0, express_async_handler_1.default)(async (req, res) => {
    // Aggregate basic public stats
    const totalOpportunities = await VisitOpportunity_1.default.countDocuments();
    const totalRequests = await VisitRequest_1.default.countDocuments();
    const totalUniversities = await User_1.default.countDocuments({ role: 'UNIVERSITY_COORDINATOR' });
    const totalCompanies = await User_1.default.countDocuments({ role: 'COMPANY_COORDINATOR' });
    res.json({
        totalOpportunities,
        totalRequests,
        totalUniversities,
        totalCompanies
    });
});
//# sourceMappingURL=statsController.js.map