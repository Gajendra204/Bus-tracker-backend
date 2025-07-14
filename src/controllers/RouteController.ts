import { Request, Response } from 'express';
import { Route } from '../models/Route';

export class RouteController {
  public static async createRoute(req: Request, res: Response) {
    try {
      const { name, stops, assignedBus, assignedDriver } = req.body;
      const route = new Route({ name, stops, assignedBus, assignedDriver });
      await route.save();
      res.status(201).json({ success: true, data: route });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async assignBusToRoute(req: Request, res: Response) {
    try {
      const { routeId, busId } = req.body;
      const route = await Route.findByIdAndUpdate(
        routeId,
        { assignedBus: busId },
        { new: true }
      ).populate('assignedBus assignedDriver');
      res.status(200).json({ success: true, data: route });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  
}