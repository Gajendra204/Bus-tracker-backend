import { Schema } from "mongoose";

export interface IRouteStop {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  arrivalTime?: string; 
  order: number; 
}

export interface IRoute {
  name: string;
  stops: IRouteStop[];
  busId?: Schema.Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}