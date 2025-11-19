import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assetRoutes from './routes/assetRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files
const __root = process.cwd();
app.use('/uploads', express.static(path.join(__root, 'uploads')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gassets';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Mongo error:', err.message);
    process.exit(1);
  });

// Auth routes
app.use('/api/auth', authRoutes);

// User profile routes
app.use('/api/users', userRoutes);

// Asset routes (search, create, mine, dashboard, home-summary, delete)
app.use('/api/assets', assetRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
