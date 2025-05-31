import { Schema } from "mongoose";

export interface IRoute extends Document {
  name: string;
  stops: string[];
  assignedDriver?: Schema.Types.ObjectId; // Ref to User (role: driver)
  assignedBus?: Schema.Types.ObjectId;    // Ref to Bus
  createdAt?: Date;
  updatedAt?: Date;
}