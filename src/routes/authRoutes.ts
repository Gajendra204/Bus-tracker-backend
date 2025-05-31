import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class AuthRoutes {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', requireRole(UserRole.ADMIN), this.authController.registerUser);
    this.router.post('/login', this.authController.login);
  }

  public getRouter(): Router {
    return this.router;
  }
}