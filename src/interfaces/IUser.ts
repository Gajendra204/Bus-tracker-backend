export enum UserRole {
  ADMIN = 'admin',
  DRIVER = 'driver',
  PARENT = 'parent'
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}