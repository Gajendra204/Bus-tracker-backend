import { Schema, model } from 'mongoose';
import { IBus } from '../interfaces/Ibus';


const busSchema = new Schema<IBus>({
  busNumber: { type: String, required: true, unique: true },
  capacity: Number,
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Bus = model<IBus>('Bus', busSchema);