import express from 'express';

import { authenticateToken } from 'middlewares/auth-middleware';
import {
  getUsers,
  getUserById,
  postNewUser,
  changeUserData,
  deleteUser,
} from 'controllers/user-controller';

const router = express.Router();

router.get('/users', authenticateToken, getUsers);
router.get('/users/:id', authenticateToken, getUserById);
router.post('/users', authenticateToken, postNewUser);
router.patch('/users/:id', authenticateToken, changeUserData);
router.delete('/users/:id', authenticateToken, deleteUser);

export default router;
