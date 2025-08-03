import { IUser } from '../interfaces/IUser';
import { AdminAuthService } from './AdminAuthService';
import { OTPService } from './OTPService';
import { TokenService } from './TokenService';

export class AuthService {
  private adminAuthService: AdminAuthService;

  constructor() {
    this.adminAuthService = new AdminAuthService();
  }

  // Admin Authentication Methods
  public async registerAdmin(userData: IUser): Promise<IUser> {
    return this.adminAuthService.registerAdmin(userData);
  }

  public async loginAdmin(email: string, password: string): Promise<string> {
    return this.adminAuthService.loginAdmin(email, password);
  }

  public async findUserByEmail(email: string): Promise<IUser | null> {
    return this.adminAuthService.findUserByEmail(email);
  }

  // OTP Authentication Methods
  public static async sendDriverOTP(phoneNumber: string): Promise<{ success: boolean; otpToken?: string }> {
    return OTPService.sendDriverOTP(phoneNumber);
  }

  public static async sendParentOTP(phoneNumber: string): Promise<{ success: boolean; otpToken?: string }> {
    return OTPService.sendParentOTP(phoneNumber);
  }

  public static async verifyDriverOTP(otpToken: string, otp: string): Promise<string> {
    const driver = await OTPService.verifyDriverOTP(otpToken, otp);
    return TokenService.generateDriverToken(driver);
  }

  public static async verifyParentOTP(otpToken: string, otp: string): Promise<string> {
    const student = await OTPService.verifyParentOTP(otpToken, otp);
    return TokenService.generateParentToken(student);
  }
}