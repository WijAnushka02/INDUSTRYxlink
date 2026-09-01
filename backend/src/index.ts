import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

import authRoutes from './routes/authRoutes';
import opportunityRoutes from './routes/opportunityRoutes';
import requestRoutes from './routes/requestRoutes';

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/opportunities', opportunityRoutes);
app.use('/api/v1/requests', requestRoutes);

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
