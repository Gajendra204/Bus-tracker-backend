import { Router } from 'express';
import { BusController } from '../controllers/BusController';
import { AuthorizationService } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class BusRoutes {
  private router: Router;
  private authService: AuthorizationService;
  private BusController: BusController;
  

  constructor() {
    this.router = Router();
    this.authService = new AuthorizationService();
    this.BusController = new BusController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create-bus', BusController.createBus);
    this.router.get('/', BusController.getAllBuses);
    this.router.patch('/assign-driver', BusController.assignDriverToBus);
  }

  public getRouter(): Router {
    return this.router;
  }
}