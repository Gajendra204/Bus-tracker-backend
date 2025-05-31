import dotenv from 'dotenv';
import db from '../config/db';
import { User } from '../models/User';
import { UserRole } from '../interfaces/IUser';
import bcrypt from 'bcryptjs';

dotenv.config();

async function createAdmin() {
  try {
    await db.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/schoolbus');

    const adminCredentials = {
      name: 'Admin',
      email: 'admin@schoolbus.com',
      password: 'admin@123',
      role: UserRole.ADMIN
    };

    console.log('Attempting to create admin user...');

    const existingAdmin = await User.findOne({ email: adminCredentials.email, role: UserRole.ADMIN });
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminCredentials.password, 10);
    const admin = new User({
      ...adminCredentials,
      password: hashedPassword
    });
    await admin.save();
    console.log('Admin user created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminCredentials.password}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();