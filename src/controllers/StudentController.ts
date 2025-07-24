import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { Route } from '../models/Route';

export class StudentController {
  public static async createStudent(req: Request, res: Response): Promise<void> {
    try {
      const { name, class: studentClass, parentName, parentPhone, address } = req.body;
      const { routeId } = req.params;

      const route = await Route.findById(routeId);
      if (!route) {
        res.status(404).json({ success: false, message: 'Route not found' });
        return;
      }

      const student = new Student({
        name,
        class: studentClass,
        routeId,
        parentName,
        parentPhone,
        address
      });

      await student.save();
      res.status(201).json({ success: true, data: student });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async getStudentsByRoute(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const { class: studentClass } = req.query;

      const route = await Route.findById(routeId);
      if (!route) {
        res.status(404).json({ success: false, message: 'Route not found' });
        return;
      }

      let query: any = { routeId };
      if (studentClass) {
        query.class = studentClass;
      }

      const students = await Student.find(query).sort({ class: 1, name: 1 });
      res.status(200).json({ success: true, data: students });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async deleteStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const student = await Student.findByIdAndDelete(id);

      if (!student) {
        res.status(404).json({ success: false, message: 'Student not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}