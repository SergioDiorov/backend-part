import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import Token from 'models/token';

type PayloadType = {
  email: string;
  id: ObjectId;
};

const jwtSecretAccess = process.env.JWT_SECRET_ACCESS as string;
const jwtSecretRefresh = process.env.JWT_SECRET_REFREFRESH as string;

export const generateTokens = (userPayload: PayloadType) => {
  const accessToken = jwt.sign(userPayload, jwtSecretAccess, {
    expiresIn: '30m',
  });
  const refreshToken = jwt.sign(userPayload, jwtSecretRefresh, {
    expiresIn: '1d',
  });
  return {
    accessToken,
    refreshToken,
  };
};

export const saveToken = async (userId: ObjectId, refreshToken: string) => {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await Token.create({ user: userId, refreshToken });
  return token;
};

export const removeToken = async (refreshToken: string) => {
  return await Token.deleteOne({ refreshToken });
};

export const findToken = async (refreshToken: string) => {
  return await Token.findOne({ refreshToken });
};

export const validateAccessToken = (token: string) => {
  try {
    return jwt.verify(token, jwtSecretAccess);
  } catch (error) {
    return null;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, jwtSecretRefresh);
  } catch (error) {
    return null;
  }
};
