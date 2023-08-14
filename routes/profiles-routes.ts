import express from 'express';

import { authenticateToken } from 'middlewares/auth-middleware';
import {
  getProfiles,
  getProfileByName,
  getAdultProfiles,
  getCountriesList,
  getCitiesList,
  addProfile,
  changeProfileData,
  deleteProfile,
  getProfilesByCountry,
  getProfilesByCity,
} from 'controllers/profile-controller';

const profilesRouter = express.Router();

profilesRouter.get('/:userId', authenticateToken, getProfiles);
profilesRouter.get('/searchByName/:userId', authenticateToken, getProfileByName);
profilesRouter.get('/searchByCountry/:userId/:country', authenticateToken, getProfilesByCountry);
profilesRouter.get('/searchByCity/:userId/:city', authenticateToken, getProfilesByCity);
profilesRouter.get('/searchAdults/:userId', authenticateToken, getAdultProfiles);
profilesRouter.get('/searchCountriesList/:userId', authenticateToken, getCountriesList);
profilesRouter.get('/searchCitiesList/:userId', authenticateToken, getCitiesList);
profilesRouter.post('/:userId', authenticateToken, addProfile);
profilesRouter.patch('/:profileId', authenticateToken, changeProfileData);
profilesRouter.delete('/:profileId', authenticateToken, deleteProfile);

export default profilesRouter;
