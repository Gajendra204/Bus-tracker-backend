import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { AuthRoutes } from './routes/authRoutes';
import db from './config/db';
import { BusRoutes } from './routes/busRoutes';
import { RouteRoutes } from './routes/routeRoutes';
import { StudentRoutes } from './routes/studentRoutes';
import { DriverRoutes } from './routes/driverRoutes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeDatabase();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    // Configure CORS to allow all origins for development
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false
    }));

    this.app.use(express.json());

    this.app.use((req, _res, next) => {
      // console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private async initializeDatabase(): Promise<void> {
    await db.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/schoolbus');
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/api/health', (_req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        endpoints: {
          'driver-otp': '/api/auth/driver/send-otp',
          'parent-otp': '/api/auth/parent/send-otp'
        }
      });
    });

    const authRoutes = new AuthRoutes();
    const busRoutes = new BusRoutes();
    const routeRoutes = new RouteRoutes();
    const studentRoutes = new StudentRoutes();
    const driverRoutes = new DriverRoutes();

    this.app.use('/api/auth', authRoutes.getRouter());
    this.app.use('/api/buses', busRoutes.getRouter());
    this.app.use('/api/routes', routeRoutes.getRouter());
    this.app.use('/api/students', studentRoutes.getRouter());
    this.app.use('/api/driver', driverRoutes.getRouter());
    

   this.app.get("/api/geocode", async (req, res) => {
  const { q } = req.query;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${q}`,
    { headers: { "User-Agent": "bus-tracker" } }
  );
  const data = await response.json();
  res.json(data);
});
  }
}

export default new App().app;