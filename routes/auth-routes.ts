import express from 'express';
import { signInUser, signUpUser } from '../controllers/auth-controller';

const authRouter = express.Router();

authRouter.post('/authUser/signup', signUpUser);
authRouter.post('/authUser/signin', signInUser);

export default authRouter;
