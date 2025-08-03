import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../interfaces/IUser';
import { TokenService } from '../services/TokenService';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: UserRole };
    }
  }
}

export class AuthorizationService {
  private extractToken(req: Request): string | null {
    const authHeader = req.header('Authorization');
    return authHeader?.replace('Bearer ', '') ?? null;
  }

  requireRole(requiredRoles: UserRole | UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const token = this.extractToken(req);
      
      if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }

      try {
        const decoded = TokenService.verifyToken(token) as { userId: string; role: UserRole };
        
        const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
        if (!roles.includes(decoded.role)) {
          res.status(403).json({ message: 'Access denied' });
          return;
        }

        req.user = decoded;
        next();
      } catch (error: any) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: error.message || 'Invalid token' });
      }
    };
  }
}