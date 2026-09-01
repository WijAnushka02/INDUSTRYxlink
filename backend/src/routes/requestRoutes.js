"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestController_1 = require("../controllers/requestController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const request_validator_1 = require("../validators/request.validator");
const router = express_1.default.Router();
router.post('/', auth_1.protect, (0, auth_1.authorize)('UNIVERSITY_COORDINATOR'), (0, validate_1.validate)(request_validator_1.createRequestSchema), requestController_1.createRequest);
router.get('/', auth_1.protect, requestController_1.getRequests);
router.put('/:id/status', auth_1.protect, (0, auth_1.authorize)('COMPANY_COORDINATOR'), (0, validate_1.validate)(request_validator_1.updateRequestStatusSchema), requestController_1.updateRequestStatus);
exports.default = router;
//# sourceMappingURL=requestRoutes.js.map