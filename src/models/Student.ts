import { Schema, model } from 'mongoose';
import { IStudent } from '../interfaces/IStudent';


const studentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  class: String,
  rollNumber: String,
  parent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBus: { type: Schema.Types.ObjectId, ref: 'Bus' },
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Student = model<IStudent>('Student', studentSchema);