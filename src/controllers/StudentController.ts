import { Request, Response } from "express";
import { StudentService } from "../services/StudentService";
import { successResponse, errorResponse } from "../utils/ResponseHandler";
import { logger } from "../utils/logger";

const studentService = new StudentService();

export class StudentController {
  public static async createStudent(req: Request, res: Response): Promise<void> {
    try {
      const { name, class: studentClass, parentName, parentPhone, pickupLocation, dropoffLocation } = req.body;
      const { routeId } = req.params;

      const student = await studentService.createStudent(
        name,
        studentClass,
        parentName,
        parentPhone,
        pickupLocation,
        dropoffLocation,
        routeId
      );

      logger.info("Student created successfully", { studentId: student._id, routeId });
      successResponse(res, student, "Student created successfully", 201);
    } catch (error: any) {
      logger.error("Error creating student", { error: error.message, routeId: req.params.routeId });
      errorResponse(res, error.message, 400);
    }
  }

  public static async getStudentsByRoute(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const { class: studentClass } = req.query;

      const students = await studentService.getStudentsByRoute(routeId, studentClass as string);
      successResponse(res, students, "Students fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching students by route", { 
        error: error.message, 
        routeId: req.params.routeId 
      });
      errorResponse(res, error.message, error.message === "Route not found" ? 404 : 500);
    }
  }

  public static async deleteStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const student = await studentService.deleteStudent(id);

      logger.info("Student deleted successfully", { studentId: id });
      successResponse(res, null, "Student deleted successfully");
    } catch (error: any) {
      logger.error("Error deleting student", { error: error.message, studentId: req.params.id });
      errorResponse(res, error.message, error.message === "Student not found" ? 404 : 400);
    }
  }
}