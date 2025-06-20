import { Router } from 'express';
import { BusController } from '../controllers/BusController';
import { AuthorizationService } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class BusRoutes {
  private router: Router;
  private authService: AuthorizationService;
  

  constructor() {
    this.router = Router();
    this.authService = new AuthorizationService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create-bus', this.authService.requireRole(UserRole.ADMIN), BusController.createBus);
    this.router.get('/', this.authService.requireRole(UserRole.ADMIN), BusController.getAllBuses);
    this.router.patch('/assign-driver', this.authService.requireRole(UserRole.ADMIN), BusController.assignDriverToBus);
  }

  public getRouter(): Router {
    return this.router;
  }
}