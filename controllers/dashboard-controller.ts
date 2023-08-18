import { Request, Response } from 'express';

import User from 'models/user';
import Profile from 'models/profile';
import { handleError } from 'errors/api-error';

export const getDashboardInfo = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    adultDate.toISOString().split('T')[0]

    const usersCount = await User.countDocuments();
    const profilesCount = await Profile.countDocuments();
    const adultProfilesCount = await Profile.countDocuments({ birthDate: { $lte: new Date(adultDate) } });

    return res
      .status(200)
      .json({
        code: 200, message: 'SUCCESS', dashboardInfo: {
          usersCount,
          profilesCount,
          adultProfilesCount
        }
      });
  } catch (err) {
    handleError(res, 500, err);
  }
};
