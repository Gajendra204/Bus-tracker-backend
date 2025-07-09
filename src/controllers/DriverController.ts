import { Request, Response } from 'express';
import { Driver } from '../models/Driver';

export class DriverController {
  public createDriver = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, phone } = req.body;
      const driver = new Driver({ name, phone });
      await driver.save();
      res.status(201).json({ success: true, data: driver });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  public getAllDrivers = async (req: Request, res: Response): Promise<void> => {
    try {
      const drivers = await Driver.find();
      res.status(200).json({ success: true, data: drivers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
