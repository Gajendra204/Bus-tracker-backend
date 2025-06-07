import { Schema, model } from 'mongoose';
import { IUser, UserRole } from '../interfaces/IUser';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true }
}, {
  timestamps: true
});

export const User = model<IUser>('User', userSchema);

export { UserRole };
