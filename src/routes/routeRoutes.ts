import { Router } from 'express';
import { RouteController } from '../controllers/RouteController';
import { AuthorizationService } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class RouteRoutes {
  private router: Router;
  private authService: AuthorizationService;
private routeController: RouteController;


  constructor() {
    this.router = Router();
    this.authService = new AuthorizationService();
    this.routeController = new RouteController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/createRoute', RouteController.createRoute);
    this.router.patch('/assignBusToRoute', RouteController.assignBusToRoute);
  }

  public getRouter(): Router {
    return this.router;
  }
}