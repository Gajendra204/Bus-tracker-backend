import { Schema } from "mongoose";

export interface IBus {
  busNumber: string;
  capacity?: number;
  assignedDriver?: Schema.Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}