import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import requestRoutes from './routes/requests'; // ✅ NEW

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', requestRoutes); // ✅ NEW

// ✅ Health check
app.get('/', (req, res) => {
  res.send('🚀 Mentorship API is running!');
});

// ✅ Start server after DB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mentorship')
  .then(() => {
    app.listen(5000, () => {
      console.log('✅ Server listening on http://localhost:5000');
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });
