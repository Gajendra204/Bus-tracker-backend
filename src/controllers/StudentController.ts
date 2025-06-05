import { Request, Response } from 'express';
import { Student } from '../models/Student';

export class StudentController {
  // Add a new student
  public static async addStudent(req: Request, res: Response) {
    try {
      const { name, class: className, rollNumber, parent } = req.body;
      const student = new Student({ name, class: className, rollNumber, parent });
      await student.save();
      res.status(201).json({ success: true, data: student });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Assign student to bus & driver
  public static async assignToBusAndDriver(req: Request, res: Response) {
    try {
      const { studentId, busId, driverId } = req.body;
      const student = await Student.findByIdAndUpdate(
        studentId,
        { assignedBus: busId, assignedDriver: driverId },
        { new: true }
      ).populate('assignedBus assignedDriver parent');
      res.status(200).json({ success: true, data: student });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}