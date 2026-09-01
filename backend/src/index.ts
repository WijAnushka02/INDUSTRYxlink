import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Sentry integration for Express
Sentry.setupExpressErrorHandler(app);

// Middleware
app.use(helmet());

// Secure CORS config
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

import authRoutes from './routes/authRoutes';
import opportunityRoutes from './routes/opportunityRoutes';
import requestRoutes from './routes/requestRoutes';
import statsRoutes from './routes/statsRoutes';

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1/auth', authLimiter, authRoutes); // Apply strict limiter to auth
app.use('/api/v1/opportunities', opportunityRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/stats', statsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('INDUSTRYxLINK API is running...');
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
