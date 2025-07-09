import { Request, Response } from 'express';
import { Bus } from '../models/Bus';

export class BusController {
 public static async createBus(req: Request, res: Response) {
  try {
    const { name, number, capacity, driverId } = req.body;
    const bus = new Bus({ 
      name, 
      busNumber: number, 
      capacity: Number(capacity),
      assignedDriver: driverId 
    });
    await bus.save();
    res.status(201).json({ success: true, data: bus });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
}

  public static async getAllBuses(req: Request, res: Response) {
  try {
    const buses = await Bus.find().populate('assignedDriver');
    
    res.status(200).json({ success: true, data: buses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

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