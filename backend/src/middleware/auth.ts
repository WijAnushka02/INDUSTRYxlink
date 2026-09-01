import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token = req.cookies?.jwt;

  if (token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }
      
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'User role not authorized' });
      return;
    }
    next();
  };
};
