import express from 'express';
import type { Router } from 'express';
import { adminOnly, protectRoute } from '../middlewares/auth.middleware.js';
import {  getAllUsersHandler, getUserByIdHandler } from '../controllers/user.controller.js';

const userRoutes: Router = express.Router();

userRoutes.get('/', protectRoute, adminOnly, getAllUsersHandler);
userRoutes.get('/:id', protectRoute,  getUserByIdHandler);


export default userRoutes;