import { Request, Response } from 'express';
import { Bus } from '../models/Bus';

export class BusController {
  // Create a new bus
  public static async createBus(req: Request, res: Response) {
    try {
      const { busNumber, capacity } = req.body;
      const bus = new Bus({ busNumber, capacity });
      await bus.save();
      res.status(201).json({ success: true, data: bus });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get all buses
  public static async getAllBuses(req: Request, res: Response) {
    try {
      const buses = await Bus.find().populate('assignedDriver', 'name email');
      res.status(200).json({ success: true, data: buses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Assign driver to bus
  public static async assignDriverToBus(req: Request, res: Response) {
    try {
      const { busId, driverId } = req.body;
      const bus = await Bus.findByIdAndUpdate(
        busId,
        { assignedDriver: driverId },
        { new: true }
      );
      res.status(200).json({ success: true, data: bus });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}