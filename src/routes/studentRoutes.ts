import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '../interfaces/IUser';

export class StudentRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/addStudent', requireRole(UserRole.ADMIN), StudentController.addStudent);
    this.router.patch('/:studentId/assign/:busId/:driverId', requireRole(UserRole.ADMIN), StudentController.assignToBusAndDriver);
  }

  public getRouter(): Router {
    return this.router;
  }
}