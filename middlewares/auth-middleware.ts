import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { handleError } from 'controllers/auth-controller';
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
      return res.status(401).json({ code: 401, message: 'No token provided' });
    }

    const decodedData = validateAccessToken(accessToken);
    if (!decodedData) {
      return res.status(403).json({ code: 403, message: 'Invalid token' });
    }
    req.user = decodedData as JwtPayload;

    next();
  } catch (err) {
    return handleError(res, err);
  }
};
