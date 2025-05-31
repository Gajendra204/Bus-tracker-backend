import { Schema } from "mongoose";

export interface IStudent extends Document {
  name: string;
  class?: string;
  rollNumber?: string;
  parent: Schema.Types.ObjectId;       // Ref to User (role: parent)
  assignedBus?: Schema.Types.ObjectId; // Ref to Bus
  assignedDriver?: Schema.Types.ObjectId; // Ref to User (role: driver)
  createdAt?: Date;
  updatedAt?: Date;
}