import { AuthorizationService } from '../../middlewares/roleMiddleware';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../interfaces/IUser';

describe('AuthorizationService', () => {
  let authService: AuthorizationService;
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: jest.Mock;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    authService = new AuthorizationService('testsecret');
  
    mockRequest = {
      header: jest.fn().mockReturnValue('Bearer validtoken')
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requireRole middleware', () => {
    it('should call next() for valid token with correct role', () => {
  
      jest.spyOn(jwt, 'verify').mockReturnValue({ role: UserRole.ADMIN } as any);
      
      const middleware = authService.requireRole(UserRole.ADMIN);
      
      middleware(mockRequest, mockResponse, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 403 for valid token with incorrect role', () => {

      jest.spyOn(jwt, 'verify').mockReturnValue({ role: UserRole.DRIVER } as any);
      
      const middleware = authService.requireRole(UserRole.ADMIN);
      
      middleware(mockRequest, mockResponse, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Access denied' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      const middleware = authService.requireRole(UserRole.ADMIN);
      
      middleware(mockRequest, mockResponse, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if no token provided', () => {
      mockRequest.header.mockReturnValue(undefined);
      
      const middleware = authService.requireRole(UserRole.ADMIN);
      
      middleware(mockRequest, mockResponse, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('private methods', () => {
    it('should extract token from Authorization header', () => {
      const middleware = authService.requireRole(UserRole.ADMIN);
      middleware(mockRequest, mockResponse, nextFunction);
      
      expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
    });

    it('should verify token with correct secret', () => {
      const verifySpy = jest.spyOn(jwt, 'verify').mockReturnValue({ role: UserRole.ADMIN } as any);
      
      const middleware = authService.requireRole(UserRole.ADMIN);
      middleware(mockRequest, mockResponse, nextFunction);
      
      expect(verifySpy).toHaveBeenCalledWith('validtoken', 'testsecret');
    });

    it('should correctly compare roles', () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({ role: UserRole.ADMIN } as any);
      
      const middleware1 = authService.requireRole(UserRole.ADMIN);
      middleware1(mockRequest, mockResponse, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
      
      nextFunction.mockClear();
      
      jest.spyOn(jwt, 'verify').mockReturnValue({ role: UserRole.DRIVER } as any);
      const middleware2 = authService.requireRole(UserRole.ADMIN);
      middleware2(mockRequest, mockResponse, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });
});