// services/StudentService.ts
import { Student } from "../models/Student";
import { Route } from "../models/Route";

export class StudentService {
  public async createStudent(
    name: string,
    studentClass: string,
    parentName: string,
    parentPhone: string,
    pickupLocation: string,
    dropoffLocation: string,
    routeId: string
  ) {
    const route = await Route.findById(routeId);
    if (!route) {
      throw new Error("Route not found");
    }

    const student = new Student({
      name,
      class: studentClass,
      routeId,
      parentName,
      parentPhone,
      pickupLocation,
      dropoffLocation,
    });

    return await student.save();
  }

  public async getStudentsByRoute(routeId: string, studentClass?: string) {
    const route = await Route.findById(routeId);
    if (!route) {
      throw new Error("Route not found");
    }

    let query: any = { routeId };
    if (studentClass) {
      query.class = studentClass;
    }

    return await Student.find(query).sort({ class: 1, name: 1 });
  }

  public async deleteStudent(id: string) {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  }
}