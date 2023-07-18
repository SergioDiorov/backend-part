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
  const tokenData = await Token.deleteOne({ refreshToken });
  return tokenData;
};

export const findToken = async (refreshToken: string) => {
  const tokenData = await Token.findOne({ refreshToken });
  return tokenData;
};

export const validateAccessToken = (token: string) => {
  try {
    const decodedData = jwt.verify(token, jwtSecretAccess);
    return decodedData;
  } catch (error) {
    return null;
  }
};

export const validaterefreshToken = (token: string) => {
  try {
    const decodedData = jwt.verify(token, jwtSecretRefresh);
    return decodedData;
  } catch (error) {
    return null;
  }
};
