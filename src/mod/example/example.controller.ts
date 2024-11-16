import { Request, Response } from 'express';

/**
 * Example ping action
 * @param {Request} req request
 * @param {Response} res response
 */
export const pingAction = (req: Request, res: Response): void => {
  res.status(200).json({ msg: 'pong' });
};
