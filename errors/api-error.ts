import { Response } from 'express';

export const handleError = (res: Response, error: unknown) => {
  return res.status(500).json({ error });
};

export const handleError401 = (res: Response, error: string) => {
  return res.status(401).json({ code: 401, message: error });
};

export const handleError403 = (res: Response, error: string) => {
  return res.status(403).json({ code: 403, message: error });
};

export const handleError409 = (res: Response, error: string) => {
  return res.status(409).json({ code: 409, message: error });
};
