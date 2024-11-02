import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { userAuthMiddleware } from '../middleware/auth.middleware.js';
import cors from 'cors';


dotenv.config();
const app = express();

const corsOption = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes Import=========================================
import userAuthRouter from '../routes/auth/auth.route.js';
import projectRouter from '../routes/work/project.route.js';

// Routes======================================
app.use('/api/v1/auth', userAuthRouter);
app.use('/api/v1/projects', projectRouter);

app.get('/whoami', userAuthMiddleware, (req, res) => {
    res.json({
        message: "You are an authenticated user",
        userID: req.userID
    });
});

export default app;