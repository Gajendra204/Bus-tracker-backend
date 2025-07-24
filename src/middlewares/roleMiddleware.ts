import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../interfaces/IUser';

export class AuthorizationService {
  private jwtSecret: string;
  
  constructor(jwtSecret: string = process.env.JWT_SECRET || 'secret_key') {
    this.jwtSecret = jwtSecret;
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.header('Authorization');
    return authHeader?.replace('Bearer ', '') ?? null;
  }

  private verifyToken(token: string): { userId: string; role: UserRole } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string; role: UserRole };
    return decoded;
    } catch(error) {
      console.error("Token verification failed:", error); 
      return null;
    }
  }

  requireRole(requiredRole: UserRole) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const token = this.extractToken(req);
      
      if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }

      const decoded = this.verifyToken(token);
      if (!decoded) {
        res.status(401).json({ message: 'Invalid token' });
        return;
      }

      if (decoded.role !== requiredRole) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      next();
    };
  }
}