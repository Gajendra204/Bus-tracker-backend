import jwt from 'jsonwebtoken';
import { Driver } from '../models/Driver';
import { Student } from '../models/Student';
import { TwilioService } from './TwilioService';

export class OTPService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
  private static OTP_LENGTH = parseInt(process.env.OTP_LENGTH || '6');


   // Generate a random OTP
  private static generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < this.OTP_LENGTH; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

   //Create JWT token containing OTP and user info 
  private static createOTPToken(payload: any): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '5m' });
  }

   //Send OTP to driver
  public static async sendDriverOTP(phoneNumber: string): Promise<{ success: boolean; otpToken?: string }> {
    const driver = await Driver.findOne({ phone: phoneNumber });
    
    if (!driver) {
      throw new Error('Driver not found');
    }

    const otp = this.generateOTP();
    
    const otpToken = this.createOTPToken({
      driverId: driver._id.toString(),
      phone: driver.phone,
      otp: otp,
      type: 'driver_otp'
    });

    console.log(`OTP ${otp} generated for driver: ${driver._id} with phone: ${driver.phone}`);

    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log(`DEVELOPMENT MODE: OTP for ${phoneNumber} is: ${otp}`);
      return { success: true, otpToken };
    }
    
    const smsSuccess = await TwilioService.sendOTP(phoneNumber, otp);
    return { success: smsSuccess, otpToken };
  }

  
   //Send OTP to parent
  public static async sendParentOTP(phoneNumber: string): Promise<{ success: boolean; otpToken?: string }> {
    const student = await Student.findOne({ parentPhone: phoneNumber });
    
    if (!student) {
      throw new Error('Parent not found');
    }

    const otp = this.generateOTP();
    
    const otpToken = this.createOTPToken({
      studentId: student._id.toString(),
      phone: student.parentPhone,
      otp: otp,
      type: 'parent_otp'
    });

    console.log(`OTP ${otp} generated for parent: ${student._id} with phone: ${student.parentPhone}`);

    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log(`DEVELOPMENT MODE: OTP for ${phoneNumber} is: ${otp}`);
      return { success: true, otpToken };
    }
    
    const smsSuccess = await TwilioService.sendOTP(phoneNumber, otp);
    return { success: smsSuccess, otpToken };
  }

  
   // Verify driver OTP
  public static async verifyDriverOTP(otpToken: string, otp: string): Promise<any> {
    try {
      const decoded = jwt.verify(otpToken, this.JWT_SECRET) as any;
      
      if (decoded.type !== 'driver_otp') {
        throw new Error('Invalid OTP token type');
      }
      
      if (decoded.otp !== otp) {
        throw new Error('Invalid OTP');
      }
      
      const driver = await Driver.findById(decoded.driverId);
      if (!driver) {
        throw new Error('Driver not found');
      }
      
      if (driver.phone !== decoded.phone) {
        throw new Error('Phone number mismatch');
      }
      
      console.log(`OTP verified for driver: ${driver._id} with phone: ${driver.phone}`);
      
      return driver;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('OTP expired');
      }
      throw new Error(error.message || 'Invalid OTP token');
    }
  }

  
   // Verify parent OTP
  public static async verifyParentOTP(otpToken: string, otp: string): Promise<any> {
    try {
      console.log('Verifying parent OTP token...');
      const decoded = jwt.verify(otpToken, this.JWT_SECRET) as any;

      if (decoded.type !== 'parent_otp') {
        throw new Error('Invalid OTP token type');
      }
      
      if (decoded.otp !== otp) {
        throw new Error('Invalid OTP');
      }
      
      const student = await Student.findById(decoded.studentId);
      if (!student) {
        throw new Error('Student not found');
      }
      
      if (student.parentPhone !== decoded.phone) {
        throw new Error('Phone number mismatch');
      }
      
      console.log(`OTP verified for parent: ${student._id} with phone: ${student.parentPhone}`);
      
      return student;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('OTP expired');
      }
      throw new Error(error.message || 'Invalid OTP token');
    }
  }
} 