import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { handleError, handleError401, handleError403 } from 'errors/api-error';
import { validateAccessToken } from 'service/token-service';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];
    if (!accessToken) {
      return handleError401(res, 'No token provided');
    }

    const decodedData = validateAccessToken(accessToken);
    if (!decodedData) {
      return handleError403(res, 'Invalid token');
    }
    req.user = decodedData as JwtPayload;

    next();
  } catch (err) {
    return handleError(res, err);
  }
};
