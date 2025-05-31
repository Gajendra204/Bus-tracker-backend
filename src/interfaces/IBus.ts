import { Schema } from "mongoose";

export interface IBus extends Document {
  busNumber: string;
  capacity?: number;
  assignedDriver?: Schema.Types.ObjectId; // Ref to User (role: driver)
  createdAt?: Date;
  updatedAt?: Date;
}