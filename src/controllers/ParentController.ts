import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { Route } from '../models/Route';
import { Bus } from '../models/Bus';
import { Driver } from '../models/Driver';

export class ParentController {
  // Get parent's child route information
  public getParentRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentPhone = req.user?.phone;

      if (!parentPhone) {
        res.status(401).json({ success: false, message: 'Parent phone not found in token' });
        return;
      }

      const students = await Student.find({ parentPhone: parentPhone });

      if (!students || students.length === 0) {
        res.status(404).json({ 
          success: false, 
          message: 'No student found for this parent' 
        });
        return;
      }

      const student = students[0];

      // Find the route assigned to this student
      const route = await Route.findById(student.routeId);

      if (!route) {
        res.status(404).json({ 
          success: false, 
          message: 'No route assigned to this student' 
        });
        return;
      }

      // Find the bus assigned to this route
      const bus = await Bus.findById(route.busId).populate('assignedDriver');

      if (!bus) {
        res.status(404).json({ 
          success: false, 
          message: 'No bus assigned to this route' 
        });
        return;
      }

      // Get driver information
      const driver = bus.assignedDriver as any;

      if (!driver) {
        res.status(404).json({ 
          success: false, 
          message: 'No driver assigned to this bus' 
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          student: {
            _id: student._id,
            name: student.name,
            class: student.class,
            pickupLocation: student.pickupLocation,
            dropoffLocation: student.dropoffLocation
          },
          route: {
            _id: route._id,
            name: route.name,
            stops: route.stops
          },
          bus: {
            _id: bus._id,
            name: bus.name,
            busNumber: bus.busNumber,
            capacity: bus.capacity
          },
          driver: {
            _id: driver._id,
            name: driver.name,
            phone: driver.phone
          },
          driverId: driver._id.toString()
        }
      });
    } catch (error: any) {
      console.error('Error in getParentRoute:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get parent profile info
  public getParentProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentPhone = req.user?.phone;

      if (!parentPhone) {
        res.status(401).json({ success: false, message: 'Parent phone not found in token' });
        return;
      }

      // Find all students associated with this parent
      const students = await Student.find({ parentPhone: parentPhone });

      if (!students || students.length === 0) {
        res.status(404).json({ 
          success: false, 
          message: 'No students found for this parent' 
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          phone: parentPhone,
          parentName: students[0].parentName, 
          children: students.map(student => ({
            _id: student._id,
            name: student.name,
            class: student.class,
            pickupLocation: student.pickupLocation,
            dropoffLocation: student.dropoffLocation
          })),
          totalChildren: students.length
        }
      });
    } catch (error: any) {
      console.error('Error in getParentProfile:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get all children for a parent
  public getParentChildren = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentPhone = req.user?.phone;

      if (!parentPhone) {
        res.status(401).json({ success: false, message: 'Parent phone not found in token' });
        return;
      }

      const students = await Student.find({ parentPhone: parentPhone }).populate('routeId');

      res.status(200).json({
        success: true,
        data: students.map(student => ({
          _id: student._id,
          name: student.name,
          class: student.class,
          pickupLocation: student.pickupLocation,
          dropoffLocation: student.dropoffLocation,
          route: student.routeId
        }))
      });
    } catch (error: any) {
      console.error('Error in getParentChildren:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
