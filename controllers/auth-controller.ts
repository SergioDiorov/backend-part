import { Request, Response } from 'express';
import User from '../models/user';
var bcrypt = require('bcrypt');

const handleError = (res: Response, error: unknown) => {
  res.status(500).json({ error });
};

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const { email, password, admin } = req.body;
    const checkEmail = await User.findOne({ email });

    if (checkEmail === null) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        ...req.body,
        password: hashedPassword,
        admin: admin || false,
      });
      let result = await user.save();
      res
        .status(201)
        .json({ code: 201, message: 'SUCCESS', userId: result._id });
    } else {
      res
        .status(409)
        .json({ code: 409, message: 'Email is already registered' });
    }
  } catch (err) {
    handleError(res, err);
  }
};
