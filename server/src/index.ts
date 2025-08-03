import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import requestRoutes from './routes/requests';

dotenv.config();

const app = express();

// ✅ CORS config
app.use(cors({
  origin: ['https://mentorshipplatformdsa.netlify.app'], // your frontend domain
  credentials: true,
}));

app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', requestRoutes);

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('🚀 Mentorship API is running!');
});

// ✅ MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorship';

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });