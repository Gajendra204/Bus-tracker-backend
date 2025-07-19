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
    // Admin-only routes
    this.router.post(
      '/',
      this.authService.requireRole(UserRole.ADMIN),
      RouteController.createRoute
    );
    
    this.router.get(
      '/',
      RouteController.getRoutes
    );
    
    this.router.get(
      '/:id',
      RouteController.getRouteById
    );
    
    this.router.put(
      '/:id',
      // this.authService.requireRole(UserRole.ADMIN),
      RouteController.updateRoute
    );
    
    this.router.delete(
      '/:id',
      // this.authService.requireRole(UserRole.ADMIN),
      RouteController.deleteRoute
    );
    
    this.router.patch(
      '/:id/assign-bus',
      // this.authService.requireRole(UserRole.ADMIN),
      RouteController.assignBusToRoute
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}