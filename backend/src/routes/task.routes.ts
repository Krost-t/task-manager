import express from 'express';
import type { Router } from 'express';
import { protectRoute , adminOnly} from "../middlewares/auth.middleware.js"
import { getDashboardData, getUserDashboardData, getTasksHandler, getTaskByIdHandler, createTaskHandler, updateTaskHandler, deleteTaskHandler, updateTaskStatusHandler, updateTaskCheklistHandler } from '../controllers/task.controller.js';



const taskRoutes: Router = express.Router();

taskRoutes.get('/dashboard-data', protectRoute, getDashboardData);
taskRoutes.get('/user-dashboard-data', protectRoute, getUserDashboardData);
taskRoutes.get('/',protectRoute,getTasksHandler);
taskRoutes.get('/:id', protectRoute, getTaskByIdHandler);
taskRoutes.post('/', protectRoute, adminOnly, createTaskHandler);
taskRoutes.put('/:id', protectRoute, updateTaskHandler);
taskRoutes.delete('/:id', protectRoute, adminOnly, deleteTaskHandler);
taskRoutes.put('/:id/status', protectRoute, updateTaskStatusHandler);
taskRoutes.put('/:id/todo', protectRoute, updateTaskCheklistHandler);

export default taskRoutes;