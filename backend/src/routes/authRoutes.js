"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const auth_validator_1 = require("../validators/auth.validator");
const router = express_1.default.Router();
router.post('/register', (0, validate_1.validate)(auth_validator_1.registerSchema), authController_1.registerUser);
router.post('/login', (0, validate_1.validate)(auth_validator_1.loginSchema), authController_1.loginUser);
router.post('/logout', authController_1.logoutUser);
router.get('/me', auth_1.protect, authController_1.getMe);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map