import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import subjectsRouter from './routes/subjects.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import passportConfig from './config/passport.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'https://nextside.onrender.com',
  credentials: true
}));

app.use(express.static(path.join(path.resolve(), 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'none'
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use(express.static(path.join(path.resolve(), 'public')));

app.get('/', (req, res) => { res.sendFile(path.join(path.resolve(), 'public/index.html')); });

app.get('/authtest', (req, res) => res.send('Auth route works'));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/subjects', subjectsRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('DB connected');
    const PORT = process.env.PORT || 7001;
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.error('DB connection error:', err));