import { Request, Response } from "express";
import { ParentService } from "../services/ParentService";
import { successResponse, errorResponse } from "../utils/ResponseHandler";
import { logger } from "../utils/logger";

const parentService = new ParentService();

export class ParentController {
  // Get parent's child route information
  public getParentRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentPhone = req.user?.phone;

      if (!parentPhone) {
        return errorResponse(res, "Parent phone not found in token", 401);
      }

      const routeData = await parentService.getParentRoute(parentPhone);

      logger.info("Parent route fetched successfully", { parentPhone });
      successResponse(res, routeData, "Parent route fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching parent route", { 
        error: error.message, 
        parentPhone: req.user?.phone 
      });
      
      const statusCode = error.message.includes("not found") ? 404 : 500;
      errorResponse(res, error.message, statusCode);
    }
  };

  // Get parent profile info
  public getParentProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentPhone = req.user?.phone;

      if (!parentPhone) {
        return errorResponse(res, "Parent phone not found in token", 401);
      }

      const profileData = await parentService.getParentProfile(parentPhone);

      logger.info("Parent profile fetched successfully", { parentPhone });
      successResponse(res, profileData, "Parent profile fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching parent profile", { 
        error: error.message, 
        parentPhone: req.user?.phone 
      });
      
      const statusCode = error.message.includes("not found") ? 404 : 500;
      errorResponse(res, error.message, statusCode);
    }
  };

  // Get all children for a parent
  public getParentChildren = async (req: Request, res: Response): Promise<void> => {
    try {
      const parentPhone = req.user?.phone;

      if (!parentPhone) {
        return errorResponse(res, "Parent phone not found in token", 401);
      }

      const childrenData = await parentService.getParentChildren(parentPhone);

      logger.info("Parent children fetched successfully", { parentPhone });
      successResponse(res, childrenData, "Parent children fetched successfully");
    } catch (error: any) {
      logger.error("Error fetching parent children", { 
        error: error.message, 
        parentPhone: req.user?.phone 
      });
      errorResponse(res, error.message, 500);
    }
  };
}