import { Request, Response } from 'express';
var bcrypt = require('bcrypt');

import User from '../models/user';
import {
  generateTokens,
  saveToken,
  removeToken,
  validaterefreshToken,
  findToken,
} from '../service/token-service';

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
      const result = await user.save();

      const userPayload = { email: result.email, id: result._id };
      const tokens = generateTokens(userPayload);
      await saveToken(result._id, tokens.refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res
        .status(201)
        .json({ code: 201, message: 'SUCCESS', user: userPayload, ...tokens });
    } else {
      return res
        .status(409)
        .json({ code: 409, message: 'Email is already registered' });
    }
  } catch (err) {
    handleError(res, err);
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(401).json({ code: 401, message: 'Wrong email' });
    }

    const checkPassword = await bcrypt.compare(password, userData.password);
    if (!checkPassword) {
      return res.status(401).json({ code: 401, message: 'Wrong password' });
    }

    const userPayload = { email: userData.email, id: userData._id };
    const tokens = generateTokens(userPayload);
    await saveToken(userData._id, tokens.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', user: userPayload, ...tokens });
  } catch (err) {
    handleError(res, err);
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await removeToken(refreshToken);
    res.clearCookie('refreshToken');
    return res.status(200).json({ code: 200, message: 'SUCCESS', token });
  } catch (err) {
    handleError(res, err);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ code: 401, message: 'Unauthorised user' });
    }

    const decodedData = validaterefreshToken(refreshToken);
    const tokenFromDb = await findToken(refreshToken);
    if (!decodedData || !tokenFromDb || typeof decodedData === 'string') {
      return res.status(401).json({ code: 401, message: 'Unauthorised user' });
    }

    const userData = await User.findById(decodedData.id);
    if (!userData) {
      return res.status(401).json({ code: 401, message: 'Unauthorised user' });
    }

    const userPayload = { email: userData.email, id: userData._id };
    const tokens = generateTokens(userPayload);
    await saveToken(userData._id, tokens.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', user: userPayload, ...tokens });
  } catch (err) {
    handleError(res, err);
  }
};
