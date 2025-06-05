import { Router } from 'express';
import { RouteController } from '../controllers/RouteController';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class RouteRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/createRoute', requireRole(UserRole.ADMIN), RouteController.createRoute);
    this.router.patch('/assign', requireRole(UserRole.ADMIN), RouteController.assignBusAndDriver);
  }

  public getRouter(): Router {
    return this.router;
  }
}