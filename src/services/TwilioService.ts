import twilio from 'twilio';
import dotenv from 'dotenv';
import { log } from 'console';
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export class TwilioService {
  private static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters first
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // If number starts with 0 remove the 0
    const withoutLeadingZero = digitsOnly.startsWith('0') 
      ? digitsOnly.substring(1) 
      : digitsOnly;
    
    // Add +91 if not already present
    return withoutLeadingZero.startsWith('91') 
      ? `+${withoutLeadingZero}`
      : `+91${withoutLeadingZero}`;
  }

  static async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      console.log(formattedNumber);
      
      await client.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedNumber
      });
      
      return true;
    } catch (error: any) {
      console.error('Twilio error:', error);
      
      if (error.code === 21408) {
        console.error(`Failed to send to  SMS permission not enabled for India`);
      } else if (error.code === 21211) {
        console.error(`Invalid number format. Attempted to send to: `);
      }
      
      return false;
    }
  }
}