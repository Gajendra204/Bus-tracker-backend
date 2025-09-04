import { Driver } from "../models/Driver";
import { Bus } from "../models/Bus";
import { Route } from "../models/Route";
import { Student } from "../models/Student";

export class DriverService {
  public async createDriver(name: string, phone: string) {
    const driver = new Driver({ name, phone });
    return await driver.save();
  }

  public async getAllDrivers() {
    return await Driver.find();
  }

  public async getDriverRoute(driverId: string) {
    // Find bus assigned to driver
    const bus = await Bus.findOne({ assignedDriver: driverId }).populate("assignedDriver");
    if (!bus) return null;

    // Find route assigned to bus
    const route = await Route.findOne({ busId: bus._id });
    if (!route) return null;

    // Find students on route
    const students = await Student.find({ routeId: route._id });

    return {
      driver: bus.assignedDriver,
      bus: {
        _id: bus._id,
        name: bus.name,
        busNumber: bus.busNumber,
        capacity: bus.capacity,
      },
      route: {
        _id: route._id,
        name: route.name,
        stops: route.stops,
      },
      students: students.map((student) => ({
        _id: student._id,
        name: student.name,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        pickupLocation: student.pickupLocation,
        dropoffLocation: student.dropoffLocation,
        class: student.class,
      })),
      totalStudents: students.length,
    };
  }

  public async getDriverProfile(driverId: string) {
    return await Driver.findById(driverId);
  }

  public async updateDriver(id: string, name: string, phone: string) {
    return await Driver.findByIdAndUpdate(id, { name, phone }, { new: true });
  }

  public async deleteDriver(id: string) {
    return await Driver.findByIdAndDelete(id);
  }
}
