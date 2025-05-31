import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { AuthRoutes } from './routes/authRoutes';
import db from './config/db';

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
    this.app.use('/api/auth', authRoutes.getRouter());
  }
}

export default new App().app;