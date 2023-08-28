import { CookieOptions, Request, Response } from 'express';
var bcrypt = require('bcrypt');

import User from 'models/user';
import {
  generateTokens,
  saveToken,
  removeToken,
  validateRefreshToken,
  findToken,
} from 'service/token-service';
import { handleError } from 'errors/api-error';

const cookieOptions: CookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  domain: process.env.COOKIES_DOMAIN,
};

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const { email, password, isAdmin } = req.body;
    const checkEmail = await User.findOne({ email });

    if (!checkEmail) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        ...req.body,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      });
      const result = await user.save();

      const userPayload = { email: result.email, id: result._id };
      const tokens = generateTokens(userPayload);
      await saveToken(result._id, tokens.refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

      return res
        .status(201)
        .json({ code: 201, message: 'SUCCESS', user: userPayload, ...tokens });
    } else {
      return handleError(res, 409, 'Email is already registered');
    }
  } catch (err) {
    handleError(res, 500, err);
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return handleError(res, 401, 'Wrong email');
    }

    const checkPassword = await bcrypt.compare(password, userData.password);
    if (!checkPassword) {
      return handleError(res, 401, 'Wrong password');
    }

    const userPayload = { email: userData.email, id: userData._id };
    const tokens = generateTokens(userPayload);
    await saveToken(userData._id, tokens.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', user: userPayload, ...tokens });
  } catch (err) {
    handleError(res, 500, err);
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await removeToken(refreshToken);
    res.clearCookie('refreshToken');
    return res.status(200).json({ code: 200, message: 'SUCCESS', token });
  } catch (err) {
    handleError(res, 500, err);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return handleError(res, 401, 'Unauthorised user');
    }

    const decodedData = validateRefreshToken(refreshToken);
    const tokenFromDb = await findToken(refreshToken);
    if (!decodedData || !tokenFromDb || typeof decodedData === 'string') {
      return handleError(res, 401, 'Unauthorised user');
    }

    const userData = await User.findById(decodedData.id);
    if (!userData) {
      return handleError(res, 401, 'Unauthorised user');
    }

    const userPayload = { email: userData.email, id: userData._id };
    const tokens = generateTokens(userPayload);
    await saveToken(userData._id, tokens.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', user: userPayload, ...tokens });
  } catch (err) {
    handleError(res, 500, err);
  }
};
