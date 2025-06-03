import { Schema } from "mongoose";

export interface IRoute extends Document {
  name: string;
  stops: string[];
  assignedDriver?: Schema.Types.ObjectId; 
  assignedBus?: Schema.Types.ObjectId;    
  createdAt?: Date;
  updatedAt?: Date;
}