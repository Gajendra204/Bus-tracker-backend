import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser, UserRole } from '../interfaces/IUser';

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

  public async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  private validateUserData(userData: IUser): void {
  const { email, password, role } = userData;

  if (!email || !password || !role) {
    throw new Error('Email, password and role are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
}

private preventAdminRegistration(role: UserRole): void {
  if (role === UserRole.ADMIN) {
    throw new Error('Cannot register admin users through this endpoint');
  }
}

private async hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

private async createUser(userData: IUser): Promise<IUser> {
  const user = new User(userData);
  await user.save();
  return user;
}

 public async registerUser(userData: IUser): Promise<IUser> {
  this.validateUserData(userData);

  const existingUser = await this.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  this.preventAdminRegistration(userData.role);

  const hashedPassword = await this.hashPassword(userData.password);
  const user = await this.createUser({ ...userData, password: hashedPassword });

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
      { expiresIn: '7d' }
    );

    return token;
  }

}




