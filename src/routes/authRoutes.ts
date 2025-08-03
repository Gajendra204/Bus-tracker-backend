import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthorizationService } from "../middlewares/roleMiddleware";
import { UserRole } from "../interfaces/IUser";

export class AuthRoutes {
  private router: Router;
  private authController: AuthController;
  private authService: AuthorizationService;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.authService = new AuthorizationService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Admin endpoints
    this.router.post("/admin/register", this.authController.registerAdmin);
    this.router.post("/admin/login", this.authController.loginAdmin);
    
    // Driver OTP endpoints
    this.router.post("/driver/send-otp", this.authController.sendDriverOTP);
    this.router.post("/driver/verify-otp", this.authController.verifyDriverOTP);

    // Parent OTP endpoints
    this.router.post("/parent/send-otp", this.authController.sendParentOTP);
    this.router.post("/parent/verify-otp", this.authController.verifyParentOTP);
  }

  public getRouter(): Router {
    return this.router;
  }
}
