import { Router } from 'express';
import { DriverController } from '../controllers/DriverController';
import { AuthorizationService } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class DriverRoutes {
  private router: Router;
  private authService: AuthorizationService;
  private driverController: DriverController;

  constructor() {
    this.router = Router();
    this.authService = new AuthorizationService();
    this.driverController = new DriverController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Admin routes
    this.router.post('/create', this.authService.requireRole(UserRole.ADMIN), this.driverController.createDriver);
    this.router.get('/', this.authService.requireRole(UserRole.ADMIN), this.driverController.getAllDrivers);
    this.router.put('/:id', this.authService.requireRole(UserRole.ADMIN), this.driverController.updateDriver);
    this.router.delete('/:id', this.authService.requireRole(UserRole.ADMIN), this.driverController.deleteDriver);

    // Driver-specific routes (authenticated driver only)
    this.router.get('/profile', this.authService.requireRole(UserRole.DRIVER), this.driverController.getDriverProfile);
    this.router.get('/route', this.authService.requireRole(UserRole.DRIVER), this.driverController.getDriverRoute);
  }

  public getRouter(): Router {
    return this.router;
  }
}
