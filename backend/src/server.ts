import express from 'express';
import cors from 'cors';
import type  { Application } from 'express';
import dotenv from 'dotenv';
import {connectDB } from './config/db.js';

// ========== Initialize App ==========
dotenv.config();
connectDB();
const app: Application = express();

// ========== Middleware ==========
// cors
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== Import Routes ==========
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import reportRoutes from './routes/report.routes.js';

// ========== Use Routes ==========
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);


// ========== Server Setup ==========
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
