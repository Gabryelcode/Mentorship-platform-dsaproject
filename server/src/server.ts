// server/src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth'; // adjust path if your route file is elsewhere
import mentorRoutes from './routes/mentor'; // Import mentor routes
import menteeRoutes from './routes/mentee'; // Import mentee routes
import requestRoutes from './routes/requests'; // Import request routes
import { request } from 'http';
import adminRoutes from './routes/admin'
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', mentorRoutes); // Use mentor routes under /api
// Connect to MongoDB
app.use('/api/requests', requestRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/mentorship')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

  