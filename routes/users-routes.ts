import express from 'express';

import { authenticateToken } from 'middlewares/auth-middleware';
import {
  getUsers,
  getUserById,
  changeUserData,
  deleteUser,
} from 'controllers/user-controller';

const router = express.Router();

router.get('', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.patch('/:id', authenticateToken, changeUserData);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
