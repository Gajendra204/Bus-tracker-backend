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
    this.router.post('/create',  this.driverController.createDriver);
    this.router.get('/', this.driverController.getAllDrivers);
  }

  public getRouter(): Router {
    return this.router;
  }
}
