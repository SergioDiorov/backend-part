import express from 'express';
import { signUpUser } from '../controllers/auth-controller';

const authRouter = express.Router();

authRouter.post('/authUser/signup', signUpUser);

export default authRouter;
