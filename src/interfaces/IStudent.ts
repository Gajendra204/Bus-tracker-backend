import { Schema } from "mongoose";

export interface IStudent{
  name: string;
  class?: string;
  rollNumber?: string;
  parent: Schema.Types.ObjectId;       
  assignedBus?: Schema.Types.ObjectId; 
  assignedDriver?: Schema.Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}