import express from 'express';

import {
  signInUser,
  signUpUser,
  signOut,
  refresh,
} from '../controllers/auth-controller';

const authRouter = express.Router();

authRouter.post('/signup', signUpUser);
authRouter.post('/signin', signInUser);
authRouter.post('/signout', signOut);
authRouter.get('/refresh', refresh);

export default authRouter;
