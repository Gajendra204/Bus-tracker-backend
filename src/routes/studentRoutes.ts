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
    this.router.get(
      '/route/:routeId',
      this.authService.requireRole(UserRole.ADMIN),
      StudentController.getStudentsByRoute
    );

    
    this.router.post(
      '/route/:routeId',
      this.authService.requireRole(UserRole.ADMIN),
      StudentController.createStudent
    );

    
    this.router.delete(
      '/:id',
      this.authService.requireRole(UserRole.ADMIN),
      StudentController.deleteStudent
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}