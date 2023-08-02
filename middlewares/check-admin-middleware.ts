import { NextFunction, Request, Response } from 'express';

import { handleError } from 'errors/api-error';
import User from 'models/user';

interface RequestWithUser extends Request {
  user?: {
    id: string;
  };
}

export const checkAdmin = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return handleError(res, 403, 'No user data provided');
    }

    const userData = await User.findById(userId).select('isAdmin');
    if (!userData?.isAdmin) {
      return handleError(res, 403, 'Access forbidden');
    }

    next();
  } catch (err) {
    return handleError(res, 500, err);
  }
};
