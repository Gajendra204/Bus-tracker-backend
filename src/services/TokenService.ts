import jwt from 'jsonwebtoken';
import { UserRole } from '../interfaces/IUser';

export class TokenService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

  
  // Generate admin access token
  public static generateAdminToken(userId: string, role: UserRole): string {
    return jwt.sign(
      { userId, role },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

   // Generate driver access token
  public static generateDriverToken(driver: any): string {
    return jwt.sign(
      { 
        userId: driver._id.toString(), 
        role: UserRole.DRIVER,
        phone: driver.phone
      },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

   // Generate parent access token
  public static generateParentToken(student: any): string {
    return jwt.sign(
      { 
        userId: student._id.toString(), 
        role: UserRole.PARENT,
        phone: student.parentPhone,
        studentId: student._id
      },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  
  // Verify JWT token
  public static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      throw new Error('Invalid token');
    }
  }
} 