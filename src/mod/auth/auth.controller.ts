import { Request, Response } from 'express';
import { createToken } from '@/utils/tokenHelpers';
import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import bcrypt from 'bcrypt';
import { getUserBO, createUserBO } from '@/mod/auth/authBO';
import ITokenRequest from '@/interfaces/ITokenRequest';

/**
 * Login action
 * @param {Request} req request
 * @param {Response} res response
 */
export const loginAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await getUserBO(username);
    if (user?.passwordHash && (await bcrypt.compare(password, user.passwordHash))) {
      const token = createToken(user);
      user.passwordHash = undefined;
      const result = { user, token };
      res
        .status(StatusCodesEnum.OK)
        .cookie('auth.token', token, { maxAge: 60 * 60 * 1000 * 2, secure: true, sameSite: 'lax' })
        .json(result);
      return;
    }

    res.status(StatusCodesEnum.BadRequest).json({ error: 'Wrong username or password !' });
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Logout action
 * @param {Request} req request
 * @param {Response} res response
 */
export const logoutAction = async (req: Request, res: Response): Promise<void> => {
  res.status(StatusCodesEnum.OK).json({ msg: 'Logout successfully !' });
};

/**
 * Register action
 * @param {Request} req request
 * @param {Response} res response
 */
export const registerAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, repeatPassword } = req.body;

    if (password !== repeatPassword) {
      res.status(StatusCodesEnum.ResourceConflict).json({ error: 'Password and repeat password are not the same !' });
      return;
    }

    const existedUser = await getUserBO(username);
    if (existedUser) {
      res.status(StatusCodesEnum.ResourceConflict).json({ error: 'User already exists !' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserBO(username, hashedPassword);
    const token = createToken(user);
    user.passwordHash = undefined;
    const result = { user, token };

    res.status(StatusCodesEnum.NewResources).json(result);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Get session action
 * @param {ITokenRequest} req request
 * @param {Response} res response
 */
export const getSessionAction = async (req: ITokenRequest, res: Response): Promise<void> => {
  try {
    const user = await getUserBO(req.username ?? '');
    if (user) {
      user.passwordHash = undefined;
      res.status(StatusCodesEnum.OK).json({ user: user, token: req.token });
      return;
    }

    res.status(StatusCodesEnum.BadRequest).json({ error: 'Session not found' });
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};
