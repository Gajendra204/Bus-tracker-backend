import mongoose from 'mongoose';

class Database {
  private static instance: Database;
  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  }
}

export default Database.getInstance();