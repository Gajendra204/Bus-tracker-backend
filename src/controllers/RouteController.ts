import { Request, Response } from "express";
import { RouteService } from "../services/RouteService";
import { successResponse, errorResponse } from "../utils/ResponseHandler";
import { logger } from "../utils/logger";

const routeService = new RouteService();

export class RouteController {
  public static async createRoute(req: Request, res: Response): Promise<void> {
    try {
      const { name, stops, busId } = req.body;
      const route = await routeService.createRoute(name, stops, busId);

      logger.info("Route created successfully", { routeId: route._id });
      successResponse(res, route, "Route created successfully", 201);
    } catch (error: any) {
      logger.error("Error creating route", { error: error.message });
      errorResponse(res, error.message, 400);
    }
  }

  public static async getRoutes(req: Request, res: Response): Promise<void> {
    try {
      const routes = await routeService.getAllRoutes();
      successResponse(res, routes, "Routes fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching routes", { error: error.message });
      errorResponse(res, error.message, 500);
    }
  }

  public static async getRouteById(req: Request, res: Response): Promise<void> {
    try {
      const route = await routeService.getRouteById(req.params.id);
      successResponse(res, route, "Route fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching route", { error: error.message });
      errorResponse(res, error.message, 404);
    }
  }

  public static async updateRoute(req: Request, res: Response): Promise<void> {
    try {
      const { name, stops, busId } = req.body;
      const route = await routeService.updateRoute(req.params.id, name, stops, busId);
      
      logger.info("Route updated successfully", { routeId: route._id });
      successResponse(res, route, "Route updated successfully");
    } catch (error: any) {
      logger.error("Error updating route", { error: error.message });
      errorResponse(res, error.message, 400);
    }
  }

  public static async deleteRoute(req: Request, res: Response): Promise<void> {
    try {
      const route = await routeService.deleteRoute(req.params.id);
      
      logger.info("Route deleted successfully", { routeId: route._id });
      successResponse(res, null, "Route deleted successfully");
    } catch (error: any) {
      logger.error("Error deleting route", { error: error.message });
      errorResponse(res, error.message, 400);
    }
  }

  public static async assignBusToRoute(req: Request, res: Response): Promise<void> {
    try {
      const { busId } = req.body;
      const route = await routeService.assignBusToRoute(req.params.id, busId);
      
      logger.info("Bus assigned to route successfully", { 
        routeId: route._id, 
        busId: busId 
      });
      successResponse(res, route, "Bus assigned to route successfully");
    } catch (error: any) {
      logger.error("Error assigning bus to route", { error: error.message });
      errorResponse(res, error.message, 400);
    }
  }
}