import { Request, Response } from "express";
import { DriverService } from "../services/DriverService";
import { successResponse, errorResponse } from "../utils/ResponseHandler";
import { logger } from "../utils/logger";

const driverService = new DriverService();

export class DriverController {
  public createDriver = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, phone } = req.body;
      const driver = await driverService.createDriver(name, phone);

      logger.info("Driver created successfully", { driverId: driver._id });
      successResponse(res, driver, "Driver created successfully", 201);
    } catch (error: any) {
      logger.error("Error creating driver", { error: error.message });
      errorResponse(res, error.message, 400);
    }
  };

  public getAllDrivers = async (req: Request, res: Response): Promise<void> => {
    try {
      const drivers = await driverService.getAllDrivers();
      successResponse(res, drivers, "Drivers fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching drivers", { error: error.message });
      errorResponse(res, error.message, 500);
    }
  };

  public getDriverRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        return errorResponse(res, "Driver ID not found in token", 401);
      }

      const routeData = await driverService.getDriverRoute(driverId);
      if (!routeData) {
        return errorResponse(res, "No bus/route assigned to this driver", 404);
      }

      successResponse(res, routeData, "Driver route fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching driver route", { error: error.message });
      errorResponse(res, error.message, 500);
    }
  };

  public getDriverProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const driverId = req.user?.userId;
      if (!driverId) {
        return errorResponse(res, "Driver ID not found in token", 401);
      }

      const driver = await driverService.getDriverProfile(driverId);
      if (!driver) {
        return errorResponse(res, "Driver not found", 404);
      }

      successResponse(res, driver, "Driver profile fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching driver profile", { error: error.message });
      errorResponse(res, error.message, 500);
    }
  };

  public updateDriver = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, phone } = req.body;

      const driver = await driverService.updateDriver(id, name, phone);
      if (!driver) {
        return errorResponse(res, "Driver not found", 404);
      }

      successResponse(res, driver, "Driver updated successfully");
    } catch (error: any) {
      logger.error("Error updating driver", { error: error.message });
      errorResponse(res, error.message, 400);
    }
  };

  public deleteDriver = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const driver = await driverService.deleteDriver(id);
      if (!driver) {
        return errorResponse(res, "Driver not found", 404);
      }

      successResponse(res, null, "Driver deleted successfully");
    } catch (error: any) {
      logger.error("Error deleting driver", { error: error.message });
      errorResponse(res, error.message, 400);
    }
  };
}
