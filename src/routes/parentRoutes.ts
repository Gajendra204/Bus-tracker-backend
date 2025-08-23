import { Router } from 'express';
import { ParentController } from '../controllers/ParentController';
import { AuthorizationService } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class ParentRoutes {
  private router: Router;
  private authService: AuthorizationService;
  private parentController: ParentController;

  constructor() {
    this.router = Router();
    this.authService = new AuthorizationService();
    this.parentController = new ParentController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/route', this.authService.requireRole(UserRole.PARENT), this.parentController.getParentRoute);
    this.router.get('/profile', this.authService.requireRole(UserRole.PARENT), this.parentController.getParentProfile);
    this.router.get('/children', this.authService.requireRole(UserRole.PARENT), this.parentController.getParentChildren);
  }

  public getRouter(): Router {
    return this.router;
  }
}
