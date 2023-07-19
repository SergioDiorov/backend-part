import { Request, Response } from 'express';

import User from 'models/user';

const handleError = (res: Response, error: unknown) => {
  res.status(500).json({ error });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    let users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    handleError(res, err);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    let user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    handleError(res, err);
  }
};

export const postNewUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    let result = await user.save();
    res.status(201).json(result);
  } catch (err) {
    handleError(res, err);
  }
};

export const changeUserData = async (req: Request, res: Response) => {
  try {
    let result = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    let result = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    handleError(res, err);
  }
};
