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
    this.router.post('/create', this.authService.requireRole(UserRole.ADMIN), this.driverController.createDriver);
    this.router.get('/', this.authService.requireRole(UserRole.ADMIN), this.driverController.getAllDrivers);
    this.router.put('/:id', this.authService.requireRole(UserRole.ADMIN), this.driverController.updateDriver);
    this.router.delete('/:id', this.authService.requireRole(UserRole.ADMIN), this.driverController.deleteDriver);
  }

  public getRouter(): Router {
    return this.router;
  }
}
