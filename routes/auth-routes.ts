import express from 'express';
import { signInUser, signUpUser } from '../controllers/auth-controller';

const authRouter = express.Router();

authRouter.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

authRouter.post('/authUser/signup', signUpUser);
authRouter.post('/authUser/signin', signInUser);

export default authRouter;
