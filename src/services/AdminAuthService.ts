import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { IUser, UserRole } from "../interfaces/IUser";
import { TokenService } from "./TokenService";

export class AdminAuthService {

   // Hash password using bcrypt 
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

   // Create new user in database
  private async createUser(userData: IUser): Promise<IUser> {
    const user = new User(userData);
    await user.save();
    return user;
  }

   // Find user by email
  public async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

   // Validate admin registration data
  private validateAdminData(userData: IUser): void {
    const { name, email, password, schoolName } = userData;

    if (!name || !email || !password || !schoolName) {
      throw new Error("Name, email, password and school name are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
  }

   // Register new admin
  public async registerAdmin(userData: IUser): Promise<IUser> {
    this.validateAdminData(userData);
    userData.role = UserRole.ADMIN;

    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await this.hashPassword(userData.password);
    const user = await this.createUser({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

   // Login admin and return access token
  public async loginAdmin(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email, role: UserRole.ADMIN });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return TokenService.generateAdminToken(user._id.toString(), user.role);
  }
}
