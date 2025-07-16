import { Schema, model } from 'mongoose';
import { IRoute } from '../interfaces/IRoute';

const routeStopSchema = new Schema({
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  arrivalTime: { type: String },
  order: { type: Number, required: true }
});

const routeSchema = new Schema<IRoute>({
  name: { type: String, required: true },
  stops: [routeStopSchema],
  busId: { type: Schema.Types.ObjectId, ref: 'Bus' },
}, { timestamps: true });

export const Route = model<IRoute>('Route', routeSchema);