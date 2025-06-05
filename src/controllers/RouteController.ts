import { Request, Response } from 'express';
import { Route } from '../models/Route';

export class RouteController {
  // Create a new route
  public static async createRoute(req: Request, res: Response) {
    try {
      const { name, stops } = req.body;
      const route = new Route({ name, stops });
      await route.save();
      res.status(201).json({ success: true, data: route });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Assign bus & driver to route
  public static async assignBusAndDriver(req: Request, res: Response) {
    try {
      const { routeId, busId, driverId } = req.body;
      const route = await Route.findByIdAndUpdate(
        routeId,
        { assignedBus: busId, assignedDriver: driverId },
        { new: true }
      ).populate('assignedBus assignedDriver');
      res.status(200).json({ success: true, data: route });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}