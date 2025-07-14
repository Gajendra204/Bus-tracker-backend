import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthorizationService } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class AuthRoutes {
  private router: Router;
  private authController: AuthController;
  private authService: AuthorizationService;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.authService = new AuthorizationService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
     this.router.post('/admin/register', this.authController.registerAdmin);
    this.router.post('/admin/login', this.authController.loginAdmin);
  }

  public getRouter(): Router {
    return this.router;
  }
}