import { Schema, model } from 'mongoose';
import { IDriver } from '../interfaces/IDriver';

const driverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });

export const Driver = model<IDriver>('Driver', driverSchema);
