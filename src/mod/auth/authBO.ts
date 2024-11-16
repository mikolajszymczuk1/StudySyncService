import User from '@/mod/auth/model/User';
import { getUserByUsernameDAO, createUserDAO } from '@/mod/auth/authDAO';

/**
 * Get user by username BO
 * @param {string} username username
 * @returns {Promise<User | null>} user object
 */
export const getUserBO = async (username: string): Promise<User | null> => {
  const userByUsername = await getUserByUsernameDAO(username);
  if (userByUsername) {
    return userByUsername;
  }

  return null;
};

/**
 * Create new user BO
 * @param username username
 * @param hashedPassword hashed password
 * @returns {Promise<User>} created user object
 */
export const createUserBO = async (username: string, hashedPassword: string): Promise<User> => {
  return await createUserDAO(username, hashedPassword);
};
