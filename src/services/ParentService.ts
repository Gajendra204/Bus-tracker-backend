import { Student } from "../models/Student";
import { Route } from "../models/Route";
import { Bus } from "../models/Bus";

export class ParentService {
  public async getParentRoute(parentPhone: string) {
    const students = await Student.find({ parentPhone });

    if (!students || students.length === 0) {
      throw new Error("No student found for this parent");
    }

    const student = students[0];
    const route = await Route.findById(student.routeId);

    if (!route) {
      throw new Error("No route assigned to this student");
    }

    const bus = await Bus.findById(route.busId).populate("assignedDriver");

    if (!bus) {
      throw new Error("No bus assigned to this route");
    }

    const driver = (bus as any).assignedDriver;

    if (!driver) {
      throw new Error("No driver assigned to this bus");
    }

    return {
      student: {
        _id: student._id,
        name: student.name,
        class: student.class,
        pickupLocation: student.pickupLocation,
        dropoffLocation: student.dropoffLocation,
      },
      route: {
        _id: route._id,
        name: route.name,
        stops: route.stops,
      },
      bus: {
        _id: bus._id,
        name: bus.name,
        busNumber: bus.busNumber,
        capacity: bus.capacity,
      },
      driver: {
        _id: driver._id,
        name: driver.name,
        phone: driver.phone,
      },
      driverId: driver._id.toString(),
    };
  }

  public async getParentProfile(parentPhone: string) {
    const students = await Student.find({ parentPhone });

    if (!students || students.length === 0) {
      throw new Error("No students found for this parent");
    }

    return {
      phone: parentPhone,
      parentName: students[0].parentName,
      children: students.map((student) => ({
        _id: student._id,
        name: student.name,
        class: student.class,
        pickupLocation: student.pickupLocation,
        dropoffLocation: student.dropoffLocation,
      })),
      totalChildren: students.length,
    };
  }

  public async getParentChildren(parentPhone: string) {
    const students = await Student.find({ parentPhone }).populate("routeId");

    return students.map((student) => ({
      _id: student._id,
      name: student.name,
      class: student.class,
      pickupLocation: student.pickupLocation,
      dropoffLocation: student.dropoffLocation,
      route: (student as any).routeId,
    }));
  }
}