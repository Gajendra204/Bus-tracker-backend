import { Schema } from "mongoose";

export interface IStudent {
  name: string;
  class: number;
  routeId: Schema.Types.ObjectId;
  parentName: string;
  parentPhone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateStudentData {
  name: string;
  class: number;
  routeId: string;
  parentName: string;
  parentPhone: string;
  address: string;
}