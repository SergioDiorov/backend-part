import express from 'express';

import {
  getUsers,
  getUserById,
  postNewUser,
  changeUserData,
  deleteUser,
} from '../controllers/user-controller';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', postNewUser);
router.patch('/users/:id', changeUserData);
router.delete('/users/:id', deleteUser);

export default router;
