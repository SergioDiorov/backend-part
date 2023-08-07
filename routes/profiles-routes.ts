import express from 'express';

import { authenticateToken } from 'middlewares/auth-middleware';
import {
  addProfile,
  changeProfileData,
  deleteProfile,
  getProfiles
} from 'controllers/profile-controller';

const profilesRouter = express.Router();

profilesRouter.get('/:userId', authenticateToken, getProfiles);
profilesRouter.post('/:userId', authenticateToken, addProfile);
profilesRouter.patch('/:profileId', authenticateToken, changeProfileData);
profilesRouter.delete('/:profileId', authenticateToken, deleteProfile);

export default profilesRouter;
