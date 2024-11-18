import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import { Request, Response } from 'express';
import { updateUserDataBO } from '@/mod/user/userBO';

/**
 * Update user data action
 * @param {Request} req request
 * @param {Response} res response
 */
export const updateDataAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, field, newValue } = req.body;

    const updatedUserData = await updateUserDataBO(Number(userId), field, newValue);
    if (!updatedUserData) {
      res.status(StatusCodesEnum.BadRequest).json({ error: 'Field value can be only: [firstName, lastName]' });
      return;
    }

    updatedUserData.passwordHash = undefined;
    res.status(StatusCodesEnum.OK).json(updatedUserData);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};
