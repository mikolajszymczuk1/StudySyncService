import jwt from 'jsonwebtoken';
import User from '@/mod/auth/model/User';

/**
 * Helper function to prepare/create new token
 * @param {User} user User object
 * @returns {string} string token
 */
export const createToken = (user: User): string => {
  const token = jwt.sign({ userId: user.id, username: user.username }, process.env.TOKEN_KEY ?? 'abcd1234', {
    expiresIn: '1h',
  });

  return token;
};
