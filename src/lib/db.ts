import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongoCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoose?: MongoCache;
};

const cached: MongoCache =
  globalWithMongo._mongoose ?? (globalWithMongo._mongoose = {
    conn: null,
    promise: null,
  });

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Add it to your .env.local file.",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
