import { Request, Response } from "express";
import { BusService } from "../services/BusService";
import { successResponse, errorResponse } from "../utils/ResponseHandler";

export class BusController {
  private busService: BusService;

  constructor() {
    this.busService = new BusService();
  }

  public createBus = async (req: Request, res: Response): Promise<void> => {
    try {
      const bus = await this.busService.createBus(req.body);
      successResponse(res, bus, "Bus created successfully", 200);
    } catch (error: any) {
      errorResponse(res, error.message, 400 );
    }
  };

  public getAllBuses = async (_req: Request, res: Response): Promise<void> => {
    try {
      const buses = await this.busService.getAllBuses();
      successResponse(res, buses, "Buses fetched successfully", 200 );
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  };

  public assignDriverToBus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { busId, driverId } = req.body;
      const bus = await this.busService.assignDriver(busId, driverId);
      successResponse(res, bus, "Driver assigned successfully", 200,);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  };

  public updateBus = async (req: Request, res: Response): Promise<void> => {
    try {
      const bus = await this.busService.updateBus(req.params.id, req.body);
      successResponse(res, bus, "Bus updated successfully", 200,);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  };

  public deleteBus = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.busService.deleteBus(req.params.id);
      successResponse(res, null, "Bus deleted successfully");
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  };
}
