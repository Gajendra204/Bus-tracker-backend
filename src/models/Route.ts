import { Schema, model } from 'mongoose';
import { IRoute } from '../interfaces/Iroute';


const routeSchema = new Schema<IRoute>({
  name: { type: String, required: true },
  stops: [String],
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedBus: { type: Schema.Types.ObjectId, ref: 'Bus' }
}, { timestamps: true });

export const Route = model<IRoute>('Route', routeSchema);