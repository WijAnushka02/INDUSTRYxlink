"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const opportunityController_1 = require("../controllers/opportunityController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const opportunity_validator_1 = require("../validators/opportunity.validator");
const router = express_1.default.Router();
router.get('/public', opportunityController_1.getPublicOpportunities); // PUBLIC ROUTE
router.post('/', auth_1.protect, (0, auth_1.authorize)('COMPANY_COORDINATOR'), (0, validate_1.validate)(opportunity_validator_1.createOpportunitySchema), opportunityController_1.createOpportunity);
router.get('/', auth_1.protect, opportunityController_1.getOpportunities);
router.get('/:id', auth_1.protect, opportunityController_1.getOpportunityById);
exports.default = router;
//# sourceMappingURL=opportunityRoutes.js.map