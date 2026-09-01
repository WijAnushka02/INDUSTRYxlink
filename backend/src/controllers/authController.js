"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const ProfileService_1 = __importDefault(require("../services/ProfileService"));
// Helper to generate and set JWT in a cookie
const generateTokenAndSetCookie = (res, userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
    }
    const token = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return token;
};
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password, role, orgName } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    // Handle profile creation based on role
    const profileIds = await ProfileService_1.default.createProfile(role, orgName);
    const user = await User_1.default.create({
        email,
        password,
        role,
        ...(profileIds.universityId && { universityId: profileIds.universityId }),
        ...(profileIds.companyId && { companyId: profileIds.companyId }),
    });
    if (user) {
        generateTokenAndSetCookie(res, user._id.toString());
        res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            universityId: user.universityId,
            companyId: user.companyId,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});
exports.loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (user && (await user.comparePassword(password))) {
        generateTokenAndSetCookie(res, user._id.toString());
        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            universityId: user.universityId,
            companyId: user.companyId,
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});
exports.logoutUser = (0, express_async_handler_1.default)(async (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});
exports.getMe = (0, express_async_handler_1.default)(async (req, res) => {
    res.status(200).json(req.user);
});
//# sourceMappingURL=authController.js.map