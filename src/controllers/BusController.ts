import { Request, Response } from 'express';
import { Bus } from '../models/Bus';

export class BusController {
 public createBus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, busNumber, capacity, driverId } = req.body;
    const bus = new Bus({ 
      name, 
      busNumber,
      capacity: Number(capacity),
      assignedDriver: driverId || undefined
    });
    await bus.save();
    const populatedBus = await Bus.populate(bus, { path: 'assignedDriver' });
    res.status(201).json({ success: true, data: bus });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
}

  public getAllBuses = async (req: Request, res: Response): Promise<void> => {
  try {
    const buses = await Bus.find().populate('assignedDriver');
    
    res.status(200).json({ success: true, data: buses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

  public assignDriverToBus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { busId, driverId } = req.body;
      const bus = await Bus.findByIdAndUpdate(
        busId,
        { assignedDriver: driverId || null  },
        { new: true }
      ).populate('assignedDriver');
      res.status(200).json({ success: true, data: bus });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

   public updateBus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, number, capacity, driverId } = req.body;
            
            const bus = await Bus.findByIdAndUpdate(
                id,
                { 
                    name,
                    busNumber: number,
                    capacity: Number(capacity),
                    assignedDriver: driverId || undefined
                },
                { new: true }
            ).populate('assignedDriver');

            if (!bus) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Bus not found' 
                });
                return;
            }

            res.status(200).json({ success: true, data: bus });
        } catch (error: any) {
            res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    public deleteBus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const bus = await Bus.findByIdAndDelete(id);

            if (!bus) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Bus not found' 
                });
                return;
            }

            res.status(200).json({ 
                success: true, 
                message: 'Bus deleted successfully' 
            });
        } catch (error: any) {
            res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
}