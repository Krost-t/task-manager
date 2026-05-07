import express from 'express';
import { adminOnly, protectRoute } from '../middlewares/auth.middleware.js';
import { exportTasksHandler, exportUsersHandler } from '../controllers/report.controller.js';

const reportRoutes: express.Router = express.Router();

reportRoutes.use(protectRoute, adminOnly);

reportRoutes.get("/export/tasks", exportTasksHandler);
reportRoutes.get("/export/users", exportUsersHandler);

export default reportRoutes;