import { Route } from "../models/Route";
import { Bus } from "../models/Bus";

export class RouteService {
  public async createRoute(name: string, stops: any[], busId?: string) {
    const stopOrders = stops.map((stop: any) => stop.order);
    if (new Set(stopOrders).size !== stops.length) {
      throw new Error("Stop orders must be unique");
    }

    if (busId) {
      const bus = await Bus.findById(busId);
      if (!bus) {
        throw new Error("Bus not found");
      }
    }

    const route = new Route({
      name,
      stops,
      busId,
    });

    return await route.save();
  }

  public async getAllRoutes() {
    return await Route.find().populate("busId", "name busNumber");
  }

  public async getRouteById(id: string) {
    const route = await Route.findById(id)
      .populate("busId", "name busNumber assignedDriver")
      .populate("busId.assignedDriver", "name phone");

    if (!route) {
      throw new Error("Route not found");
    }

    return route;
  }

  public async updateRoute(id: string, name: string, stops: any[], busId?: string) {
    const route = await Route.findByIdAndUpdate(
      id,
      { name, stops, busId },
      { new: true }
    );

    if (!route) {
      throw new Error("Route not found");
    }

    return route;
  }

  public async deleteRoute(id: string) {
    const route = await Route.findByIdAndDelete(id);

    if (!route) {
      throw new Error("Route not found");
    }

    return route;
  }

  public async assignBusToRoute(routeId: string, busId: string) {
    const bus = await Bus.findById(busId);
    if (!bus) {
      throw new Error("Bus not found");
    }

    const route = await Route.findByIdAndUpdate(
      routeId,
      { busId },
      { new: true }
    );

    if (!route) {
      throw new Error("Route not found");
    }

    return route;
  }
}