import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../interfaces/IUser';

export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'process.env.JWT_SECRET') as { role: UserRole };
      console.log('Decoded Token:', decoded); 
      if (decoded.role !== role) {
        console.log('Role mismatch:', decoded.role);
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      next();
    } catch (error) {
      console.log('Token verification failed:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};