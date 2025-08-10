import { Request, Response } from 'express';
import { Driver } from '../models/Driver';
import { Bus } from '../models/Bus';
import { Route } from '../models/Route';
import { Student } from '../models/Student';

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

  // Get driver's assigned route information with students
  public getDriverRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const driverId = req.user?.userId;

      if (!driverId) {
        res.status(401).json({ success: false, message: 'Driver ID not found in token' });
        return;
      }

      // bus assigned to this driver
      const bus = await Bus.findOne({ assignedDriver: driverId }).populate('assignedDriver');

      if (!bus) {
        res.status(404).json({ success: false, message: 'No bus assigned to this driver' });
        return;
      }

      // route assigned to this bus
      const route = await Route.findOne({ busId: bus._id });

      if (!route) {
        res.status(404).json({ success: false, message: 'No route assigned to this bus' });
        return;
      }

      // Find all students assigned to this route
      const students = await Student.find({ routeId: route._id });

      res.status(200).json({
        success: true,
        data: {
          driver: bus.assignedDriver,
          bus: {
            _id: bus._id,
            name: bus.name,
            busNumber: bus.busNumber,
            capacity: bus.capacity
          },
          route: {
            _id: route._id,
            name: route.name,
            stops: route.stops
          },
          students: students.map(student => ({
            _id: student._id,
            name: student.name,
            parentName: student.parentName,
            parentPhone: student.parentPhone,
            pickupLocation: student.pickupLocation,
            dropoffLocation: student.dropoffLocation,
            class: student.class
          })),
          totalStudents: students.length
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get driver profile info
  public getDriverProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const driverId = req.user?.userId;

      if (!driverId) {
        res.status(401).json({ success: false, message: 'Driver ID not found in token' });
        return;
      }

      const driver = await Driver.findById(driverId);

      if (!driver) {
        res.status(404).json({ success: false, message: 'Driver not found' });
        return;
      }

      res.status(200).json({ success: true, data: driver });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

   public updateDriver = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, phone } = req.body;
            
            const driver = await Driver.findByIdAndUpdate(
                id,
                { name, phone },
                { new: true }
            );

            if (!driver) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Driver not found' 
                });
                return;
            }

            res.status(200).json({ success: true, data: driver });
        } catch (error: any) {
            res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
    };

    public deleteDriver = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const driver = await Driver.findByIdAndDelete(id);

            if (!driver) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Driver not found' 
                });
                return;
            }

            res.status(200).json({ 
                success: true, 
                message: 'Driver deleted successfully' 
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };
}
