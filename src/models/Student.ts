import { Schema, model } from 'mongoose';
import { IStudent } from '../interfaces/IStudent';

const studentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  class: { type: Number, required: true, min: 1, max: 12 },
  routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
}, { timestamps: true });

export const Student = model<IStudent>('Student', studentSchema);