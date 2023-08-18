import express from 'express';

import { authenticateToken } from 'middlewares/auth-middleware';
import { checkAdmin } from 'middlewares/check-admin-middleware';
import { getDashboardInfo } from 'controllers/dashboard-controller';

const dashboardRouter = express.Router();

dashboardRouter.get('', authenticateToken, checkAdmin, getDashboardInfo);

export default dashboardRouter;
