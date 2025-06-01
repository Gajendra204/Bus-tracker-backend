import { Router } from 'express';
import { BusController } from '../controllers/BusController';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class BusRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Only admins can manage buses
    this.router.post('/', requireRole(UserRole.ADMIN), BusController.createBus);
    this.router.get('/', requireRole(UserRole.ADMIN), BusController.getAllBuses);
    this.router.patch('/:busId/assign-driver/:driverId', requireRole(UserRole.ADMIN), BusController.assignDriverToBus);
  }

  public getRouter(): Router {
    return this.router;
  }
}