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
      
     this.successResponse(res, 201, "Admin registered successfully", {
        name: user.name,
        username: user.email,
        schoolName: user.schoolName,
        role: user.role,
      });
    } catch (error: any) {
      this.errorResponse(res, 400, error.message);
    }
  };

  public loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.loginAdmin(email, password);
      
      this.successResponse(res, 200, "Login successful", { token });
    } catch (error: any) {
      this.errorResponse(res, 401, error.message);
    }
  };

   public sendDriverOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.body;
      const result = await AuthService.sendDriverOTP(phoneNumber);
      
      this.successResponse(res, 200, result.success ? "OTP sent successfully" : "Failed to send OTP", {
      otpToken: result.otpToken,
      });
    } catch (error: any) {
      this.errorResponse(res, 400, error.message);
    }
  };

  public sendParentOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.body;
      const result = await AuthService.sendParentOTP(phoneNumber);
      
       this.successResponse(res, 200, result.success ? "OTP sent successfully" : "Failed to send OTP", {
        otpToken: result.otpToken,
      });
    } catch (error: any) {
      this.errorResponse(res, 400, error.message);
    }
  };

  public verifyDriverOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { otpToken, otp } = req.body;
      const token = await AuthService.verifyDriverOTP(otpToken, otp);
      
      this.successResponse(res, 200, "Driver OTP verified successfully", { token });
    } catch (error: any) {
      this.errorResponse(res, 401, error.message);
    }
  };

  public verifyParentOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { otpToken, otp } = req.body;

      const token = await AuthService.verifyParentOTP(otpToken, otp);

        this.successResponse(res, 200, "Parent OTP verified successfully", { token });
    } catch (error: any) {
      this.errorResponse(res, 401, error.message);
    }
  };

  // Helper Methods
 private successResponse(res: Response, status: number, message: string, data: any = {}) {
    res.status(status).json({ success: true, message, data });
  }

  private errorResponse(res: Response, status: number, message: string) {
    res.status(status).json({ success: false, message });
  }
}

