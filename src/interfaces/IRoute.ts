import { Schema } from "mongoose";

export interface IRoute {
  name: string;
  stops: string[];
  assignedBus?: Schema.Types.ObjectId;    
  createdAt?: Date;
  updatedAt?: Date;
}