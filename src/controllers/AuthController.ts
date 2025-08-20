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

   public sendDriverOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.body;
      const result = await AuthService.sendDriverOTP(phoneNumber);
      
      res.status(200).json({
        success: result.success,
        message: result.success ? 'OTP sent successfully' : 'Failed to send OTP',
        data: {
          otpToken: result.otpToken 
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  public sendParentOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.body;
      const result = await AuthService.sendParentOTP(phoneNumber);
      
      res.status(200).json({
        success: result.success,
        message: result.success ? 'OTP sent successfully' : 'Failed to send OTP',
        data: {
          otpToken: result.otpToken 
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  public verifyDriverOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { otpToken, otp } = req.body;
      const token = await AuthService.verifyDriverOTP(otpToken, otp);
      
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

  public verifyParentOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { otpToken, otp } = req.body;

      const token = await AuthService.verifyParentOTP(otpToken, otp);
      console.log('Parent OTP verification successful');

      res.status(200).json({
        success: true,
        data: { token }
      });
    } catch (error: any) {
      console.log('Parent OTP verification failed:', error.message);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };
}