import { AuthService } from '../../services/AuthService';
import { User, UserRole } from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../models/User');

describe('AuthService', () => {
  let authService: AuthService; 

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user with valid data', async () => {
      const mockUser = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: 'hashedpassword',
        role: 'PARENT',
        save: jest.fn().mockResolvedValue(true)
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as unknown as jest.Mock).mockReturnValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const userData = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: 'password123',
        role: UserRole.PARENT
      };

      const result = await authService.registerUser(userData);
      
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@gmail.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw error if email already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@gmail.com' });
      
      const userData = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: 'password123',
        role: UserRole.PARENT
      };

      await expect(authService.registerUser(userData)).rejects.toThrow('User already exists');
    });

    it('should throw error if password is too short', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      const userData = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: '123',
        role: UserRole.PARENT
      };

      await expect(authService.registerUser(userData))
        .rejects.toThrow('Password must be at least 6 characters');
    });

    it('should throw error when trying to register admin', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      const userData = {
        name: 'Test Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: UserRole.ADMIN
      };

      await expect(authService.registerUser(userData))
        .rejects.toThrow('Cannot register admin users through this endpoint');
    });
  });

  describe('loginUser', () => {
    it('should return a token for valid credentials', async () => {
      const mockUser = {
        email: 'test@gmail.com',
        password: 'hashedpassword',
        role: 'PARENT',
        _id: '123'
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwt, 'sign').mockReturnValue('mocktoken' as never);

      const token = await authService.loginUser('test@gmail.com', 'password123');
      
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@gmail.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: '123', role: 'PARENT' },
        'secret-key',
        { expiresIn: '1h' }
      );
      expect(token).toBe('mocktoken');
    });

    it('should throw error for invalid credentials', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      await expect(authService.loginUser('wrongtest@gmail.com', 'password123')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is incorrect', async () => {
  const mockUser = {
    email: 'test@gmail.com',
    password: 'hashedpassword',
  };

  (User.findOne as jest.Mock).mockResolvedValue(mockUser);
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

  await expect(authService.loginUser('test@gmail.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
});
  });
});