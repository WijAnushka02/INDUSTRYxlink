import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ProfileService from '../services/ProfileService';

// Helper to generate and set JWT in a cookie
const generateTokenAndSetCookie = (res: Response, userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
  }

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
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

export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password, role, orgName } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Handle profile creation based on role
  const profileIds = await ProfileService.createProfile(role, orgName);

  const user = await User.create({
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
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    generateTokenAndSetCookie(res, user._id.toString());
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
      companyId: user.companyId,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const logoutUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req: any, res: Response): Promise<void> => {
  res.status(200).json(req.user);
});
