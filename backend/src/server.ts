import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import listingRoutes from './routes/listing.routes';
import userRoutes from './routes/user.routes';
import blogRoutes from './routes/blog.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/logger.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// ... middlewares are preserved ...
app.use((req, res, next) => {
  console.log(`➡️  Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost port or if origin is not present (e.g. server-to-server)
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else if (origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(requestLogger);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Rentlee API is running 🚀' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/blogs', blogRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── DB + Server Start ───────────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  MongoDB connected successfully');

    app.listen(Number(PORT), '127.0.0.1', () => {
      console.log(`🚀  Rentlee server running on http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error('❌  Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

startServer();

export default app;
