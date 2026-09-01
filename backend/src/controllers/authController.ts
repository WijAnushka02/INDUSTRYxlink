import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import University from '../models/University';
import Company from '../models/Company';

const generateToken = (id: string, role: string, profileId?: string, profileModel?: string) => {
  return jwt.sign({ id, role, profileId, profileModel }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, orgName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileId;
    let profileModel;

    // Create the organization profile based on role
    if (role === 'UNIVERSITY_COORDINATOR' && orgName) {
      const university = await University.create({ name: orgName, coordinators: [] });
      profileId = university._id;
      profileModel = 'University';
    } else if (role === 'COMPANY_COORDINATOR' && orgName) {
      const company = await Company.create({ name: orgName, coordinators: [] });
      profileId = company._id;
      profileModel = 'Company';
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      profileId,
      profileModel,
    });

    // Update the organization with the new coordinator
    if (profileModel === 'University') {
      await University.findByIdAndUpdate(profileId, { $push: { coordinators: user._id } });
    } else if (profileModel === 'Company') {
      await Company.findByIdAndUpdate(profileId, { $push: { coordinators: user._id } });
    }

    res.status(201).json({
      _id: user.id,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role, user.profileId?.toString(), user.profileModel),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password || ''))) {
      res.json({
        _id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role, user.profileId?.toString(), user.profileModel),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
