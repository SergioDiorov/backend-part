import express from 'express';

import { authenticateToken } from 'middlewares/auth-middleware';
import {
  getUsers,
  getUserById,
  changeUserData,
  deleteUser,
} from 'controllers/user-controller';
import { checkAdmin } from 'middlewares/check-admin-middleware';

const router = express.Router();

router.get('', authenticateToken, checkAdmin, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.patch('/:id', authenticateToken, checkAdmin, changeUserData);
router.delete('/:id', authenticateToken, checkAdmin, deleteUser);

export default router;
