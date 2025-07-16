import { Schema, model } from 'mongoose';
import { IBus } from '../interfaces/IBus';


const busSchema = new Schema<IBus>({
  name: { type: String, required: true },  
  busNumber: { type: String, required: true, unique: true },
  capacity: Number,
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'Driver' }
}, { timestamps: true });

export const Bus = model<IBus>('Bus', busSchema);