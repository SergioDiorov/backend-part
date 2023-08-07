import { Request, Response } from 'express';

import Profile from 'models/profile';
import { handleError } from 'errors/api-error';

export const getProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await Profile.find({ user: req.params.userId })
    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', profiles });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const addProfile = async (req: Request, res: Response) => {
  try {
    const profile = new Profile({
      ...req.body,
      user: req.params.userId
    });
    const savedProfile = await profile.save();

    return res
      .status(201)
      .json({ code: 201, message: 'SUCCESS', savedProfile });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const changeProfileData = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.profileId, req.body, { new: true });
    res.status(200).json({ message: 'SUCCESS', profile });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.profileId);
    res.status(200).json({ message: 'SUCCESS', profile });
  } catch (err) {
    return handleError(res, 500, err);
  }
};
