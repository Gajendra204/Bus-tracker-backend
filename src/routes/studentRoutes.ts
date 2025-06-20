import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { AuthorizationService } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class StudentRoutes {
  private router: Router;
  private authService: AuthorizationService;

  constructor() {
    this.router = Router();
    this.authService = new AuthorizationService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/addStudent', this.authService.requireRole(UserRole.ADMIN), StudentController.addStudent);
    this.router.patch('/assign', this.authService.requireRole(UserRole.ADMIN), StudentController.assignToBusAndDriver);
  }

  public getRouter(): Router {
    return this.router;
  }
}