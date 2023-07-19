import { Response } from 'express';

export const handleError = (res: Response, code: number, error: unknown) => {
  return res.status(code).json({ code, message: error });
};
