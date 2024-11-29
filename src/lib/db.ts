import { mongoose } from '@typegoose/typegoose';

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedConnection | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI_DEV || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define either MONGODB_URI_DEV or MONGODB_URI environment variable');
}

const mongooseOptions = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
} as const;

const _cached: CachedConnection = global.mongoose ?? {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = _cached;
}

async function connectDB(): Promise<typeof mongoose> {
  try {
    if (_cached.conn) {
      return _cached.conn;
    }

    if (!_cached.promise) {
      _cached.promise = mongoose.connect(MONGODB_URI as string, mongooseOptions);
    }

    const conn = await _cached.promise;
    _cached.conn = conn;
    return conn;
  } catch (e) {
    _cached.promise = null;
    const error = e instanceof Error ? e : new Error('Failed to connect to MongoDB');
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB; 