import { Request, Response } from 'express';

import User from 'models/user';
import { handleError } from 'errors/api-error';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find(
      {},
      { userName: 1, email: 1, isAdmin: 1, _id: 1 }
    );

    res.status(200).json({ message: 'SUCCESS', users });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select(
      'userName email isAdmin _id'
    );

    res.status(200).json({ message: 'SUCCESS', user });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const changeUserData = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('userName email isAdmin _id');

    res.status(200).json({ message: 'SUCCESS', user });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select(
      'userName email isAdmin _id'
    );

    res.status(200).json({ message: 'SUCCESS', user });
  } catch (err) {
    return handleError(res, 500, err);
  }
};
