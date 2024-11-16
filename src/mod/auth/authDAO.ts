import pgClient from '@/db/pgClient';
import User from '@/mod/auth/model/User';

/**
 * Get user by username from database DAO
 * @param {string} username username
 * @returns {Promise<User | null>} user object
 */
export const getUserByUsernameDAO = async (username: string): Promise<User | null> => {
  const user = await pgClient.user.findFirst({ where: { username: username } });
  return user ? User.userFromPrisma(user) : null;
};

/**
 * Create new user in database DAO
 * @param username username
 * @param hashedPassword hashed password
 * @returns {Promise<User>} created user object
 */
export const createUserDAO = async (username: string, hashedPassword: string): Promise<User> => {
  const user = await pgClient.user.create({
    data: {
      username: username,
      passwordHash: hashedPassword,
      firstName: 'First Name',
      lastName: 'Last Name',
    },
  });

  return User.userFromPrisma(user);
};
