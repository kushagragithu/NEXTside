import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import subjectsRouter from './routes/subjects.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(path.resolve(), '../public')));

app.get('/subjects', (req, res) => {
  res.sendFile(path.join(path.resolve(), '../public/index.html'));
});

app.use('/subjects', subjectsRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 7001;
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
