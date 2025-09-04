import { Bus } from "../models/Bus";
import { logger } from "../utils/logger";

export class BusService {
  async createBus(data: { name: string; busNumber: string; capacity: number; driverId?: string }) {
    const bus = new Bus({
      name: data.name,
      busNumber: data.busNumber,
      capacity: Number(data.capacity),
      assignedDriver: data.driverId || undefined,
    });

    await bus.save();
    const populatedBus = await Bus.populate(bus, { path: "assignedDriver" });

    logger.info("Bus created successfully", { busId: bus._id });
    return populatedBus;
  }

  async getAllBuses() {
    return Bus.find().populate("assignedDriver");
  }

  async assignDriver(busId: string, driverId?: string) {
    const bus = await Bus.findByIdAndUpdate(
      busId,
      { assignedDriver: driverId || null },
      { new: true }
    ).populate("assignedDriver");

    if (!bus) {
      throw new Error("Bus not found");
    }

    logger.info("Driver assigned to bus", { busId, driverId });
    return bus;
  }

  async updateBus(id: string, data: { name: string; number: string; capacity: number; driverId?: string }) {
    const bus = await Bus.findByIdAndUpdate(
      id,
      {
        name: data.name,
        busNumber: data.number,
        capacity: Number(data.capacity),
        assignedDriver: data.driverId || undefined,
      },
      { new: true }
    ).populate("assignedDriver");

    if (!bus) {
      throw new Error("Bus not found");
    }

    logger.info("Bus updated successfully", { busId: id });
    return bus;
  }

  async deleteBus(id: string) {
    const bus = await Bus.findByIdAndDelete(id);

    if (!bus) {
      throw new Error("Bus not found");
    }

    logger.info("Bus deleted successfully", { busId: id });
    return bus;
  }
}
