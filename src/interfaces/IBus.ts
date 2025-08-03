import { Schema } from "mongoose";

export interface IBus {
  name: string;           
  busNumber: string;
  capacity?: number;
  assignedDriver?: Schema.Types.ObjectId;  
  createdAt?: Date;
  updatedAt?: Date;
}