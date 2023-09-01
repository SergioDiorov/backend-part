import { Request, Response } from 'express';

import Profile from 'models/profile';
import { handleError } from 'errors/api-error';
import { getFileStream, uploadFile, deleteFile } from 'assets/s3';

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

export const getProfileByName = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const profileName = req.query.profileName;

    const searchResults = await Profile.find({ user: userId, name: { $regex: profileName, $options: 'i' } }).lean();
    if (!searchResults.length) {
      return handleError(res, 404, 'No profiles found with this name');
    }

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', profiles: searchResults });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const getAdultProfiles = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const today = new Date();
    const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    adultDate.toISOString().split('T')[0]

    const adultUsers = await Profile.find({
      user: userId,
      birthDate: { $lte: new Date(adultDate) }
    });

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', profiles: adultUsers });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const getProfilesByCountry = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const country = req.params.country;

    const searchResults = await Profile.find({ user: userId, "location.country": { $regex: new RegExp(`^${country}$`, 'i') } }).lean();
    if (!searchResults.length) {
      return handleError(res, 404, 'No profiles found with this country')
    }

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', profiles: searchResults });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const getProfilesByCity = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const city = req.params.city;

    const searchResults = await Profile.find({ user: userId, "location.city": { $regex: new RegExp(`^${city}$`, 'i') } }).lean();
    if (!searchResults.length) {
      return handleError(res, 404, 'No profiles found with this city')
    }

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', profiles: searchResults });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const getCountriesList = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const country = req.query.country;

    const matchingCountries = await Profile.distinct('location.country', {
      user: userId,
      'location.country': { $regex: country, $options: 'i' }
    });

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', searchList: matchingCountries });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const getCitiesList = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const city = req.query.city;

    const matchingCountries = await Profile.distinct('location.city', {
      user: userId,
      'location.city': { $regex: city, $options: 'i' }
    });

    return res
      .status(200)
      .json({ code: 200, message: 'SUCCESS', searchList: matchingCountries });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const addProfile = async (req: Request, res: Response) => {
  try {
    let result;
    if (req.file) {
      result = await uploadFile(req.file);
    }

    const profileToSave = new Profile({
      ...req.body,
      user: req.params.userId,
      photo: result?.Key,
    });

    const profile = await profileToSave.save();

    return res
      .status(201)
      .json({ code: 201, message: 'SUCCESS', profile });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const changeProfileData = async (req: Request, res: Response) => {
  try {
    let result;

    if (req.file) {
      result = await uploadFile(req.file);
      req.body.photo = result?.Key;
      const oldProfile = await Profile.findById(req.params.profileId);
      oldProfile?.photo && await deleteFile(oldProfile.photo);
    }

    const profile = await Profile.findByIdAndUpdate(req.params.profileId, req.body, { new: true });
    res.status(200).json({ message: 'SUCCESS', profile });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.profileId);

    if (profile?.photo) {
      await deleteFile(profile.photo);
    }

    res.status(200).json({ message: 'SUCCESS', profile });
  } catch (err) {
    return handleError(res, 500, err);
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
  } catch (err) {
    return handleError(res, 500, err);
  }
};
