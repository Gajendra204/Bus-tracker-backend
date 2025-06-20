import { Router } from 'express';
import { RouteController } from '../controllers/RouteController';
import { AuthorizationService } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class RouteRoutes {
  private router: Router;
  private authService: AuthorizationService;


  constructor() {
    this.router = Router();
    this.authService = new AuthorizationService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/createRoute', this.authService.requireRole(UserRole.ADMIN), RouteController.createRoute);
    this.router.patch('/assign', this.authService.requireRole(UserRole.ADMIN), RouteController.assignBusAndDriver);
  }

  public getRouter(): Router {
    return this.router;
  }
}