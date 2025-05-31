import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser, UserRole } from '../interfaces/IUser';

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  public async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  public async registerUser(userData: IUser): Promise<IUser> {
    const { email, role, password } = userData;
    
    if (!email || !password || !role) {
      throw new Error('Email, password and role are required');
    }

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    if (role === UserRole.ADMIN) {
      throw new Error('Cannot register admin users through this endpoint');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      ...userData,
      password: hashedPassword
    });

    await user.save();
    return user;
  }

  public async loginUser(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      AuthService.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return token;
  }

}