import { Request, Response } from 'express';
import { Route } from '../models/Route';
import { Bus } from '../models/Bus';

export class RouteController {
  public static async createRoute(req: Request, res: Response): Promise<void> {
    try {
      const { name, stops, busId } = req.body;
      
      const stopOrders = stops.map((stop: any) => stop.order);
      if (new Set(stopOrders).size !== stops.length) {
        throw new Error('Stop orders must be unique');
      }

      if (busId) {
        const bus = await Bus.findById(busId);
        if (!bus) {
          throw new Error('Bus not found');
        }
      }

      const route = new Route({ 
        name, 
        stops,
        busId,
      });
      
      await route.save();
      res.status(201).json({ success: true, data: route });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async getRoutes(req: Request, res: Response): Promise<void> {
    try {
      const routes = await Route.find()
        .populate('busId', 'name busNumber');
      res.status(200).json({ success: true, data: routes });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getRouteById(req: Request, res: Response): Promise<void> {
    try {
      const route = await Route.findById(req.params.id)
        .populate('busId', 'name busNumber assignedDriver')
        .populate('busId.assignedDriver', 'name phone');
      
      if (!route) {
        throw new Error('Route not found');
      }
      
      res.status(200).json({ success: true, data: route });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  public static async updateRoute(req: Request, res: Response): Promise<void> {
    try {
      const { name, stops, busId } = req.body;
      const route = await Route.findByIdAndUpdate(
        req.params.id,
        { name, stops, busId },
        { new: true }
      );
      
      if (!route) {
        throw new Error('Route not found');
      }
      
      res.status(200).json({ success: true, data: route });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async deleteRoute(req: Request, res: Response): Promise<void> {
    try {
      const route = await Route.findByIdAndDelete(req.params.id);
      
      if (!route) {
        throw new Error('Route not found');
      }
      
      res.status(200).json({ success: true, message: 'Route deleted' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async assignBusToRoute(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.body;
      
      const bus = await Bus.findById(busId);
      if (!bus) {
        throw new Error('Bus not found');
      }
      
      const route = await Route.findByIdAndUpdate(
        req.params.id,
        { busId },
        { new: true }
      );
      
      if (!route) {
        throw new Error('Route not found');
      }
      
      res.status(200).json({ success: true, data: route });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}