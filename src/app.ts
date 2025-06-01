import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { AuthRoutes } from './routes/authRoutes';
import db from './config/db';
import { BusRoutes } from './routes/busRoutes';
import { RouteRoutes } from './routes/routeRoutes';
import { StudentRoutes } from './routes/studentRoutes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeDatabase();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private async initializeDatabase(): Promise<void> {
    await db.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/schoolbus');
  }

  private initializeRoutes(): void {
    const authRoutes = new AuthRoutes();
    const busRoutes = new BusRoutes();
    const routeRoutes = new RouteRoutes();
    const studentRoutes = new StudentRoutes();
    
    this.app.use('/api/auth', authRoutes.getRouter());
    this.app.use('/api/buses', busRoutes.getRouter());
    this.app.use('/api/routes', routeRoutes.getRouter());
    this.app.use('/api/students', studentRoutes.getRouter());
  }
}

export default new App().app;