import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { IUser } from '../interfaces/IUser';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public registerAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: IUser = req.body;
      
      if (!userData.password) {
        throw new Error('Password is required');
      }

      const user = await this.authService.registerAdmin(userData);
      
      res.status(201).json({
        success: true,
        data: { 
          name: user.name, 
          username: user.email,
          schoolName: user.schoolName,
          role: user.role 
        },
        message: 'Admin registered successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  public loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.loginAdmin(email, password);
      
      res.status(200).json({
        success: true,
        data: { token }
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };
}