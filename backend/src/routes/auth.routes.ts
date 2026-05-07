import express from 'express';
import type { Router } from 'express';
import { registerHandler, loginHandler, getUserHandler, updateUserHandler,uploadProfileImageHandler } from '../controllers/auth.controller.js';
import { protectRoute } from "../middlewares/auth.middleware.js"
import upload from '../middlewares/upload.middleware copy.js';

const authRoutes: Router = express.Router();

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/profile', protectRoute, getUserHandler);
authRoutes.put('/profile', protectRoute, updateUserHandler);

authRoutes.post("/upload-profile-image", upload.single("image"), uploadProfileImageHandler);



export default authRoutes;