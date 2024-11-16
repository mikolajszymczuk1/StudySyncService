import type { Response, NextFunction } from 'express';
import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import jwt from 'jsonwebtoken';
import type ITokenRequest from '@/interfaces/ITokenRequest';

/**
 * Middleware to verify jwt token from user
 * @param {TokenRequest} req Request
 * @param {Response} res Response
 * @param {NextFunction} next Next function
 */
export const verifyToken = (req: ITokenRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(StatusCodesEnum.ResourceForbidden).json({ error: 'No token provided or invalid format' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY ?? 'abcd1234') as jwt.JwtPayload;
    req.userId = decoded.userId;
    req.username = decoded.username;
    req.token = token;
    next();
  } catch (err) {
    res.status(StatusCodesEnum.Unauthorized).json({ error: 'Invalid or expired token' });
  }
};
