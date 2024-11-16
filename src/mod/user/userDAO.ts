import pgClient from '@/db/pgClient';
import User from '@/mod/auth/model/User';

/**
 * Updated user data in database
 * @param {number} userId user id
 * @param {string} field field to edit
 * @param {string} newValue new value for field
 * @returns {Promise<User>} Updated user object
 */
export const updateUserDataDAO = async (userId: number, field: string, newValue: string): Promise<User> => {
  const updatedUser = await pgClient.user.update({ where: { id: userId }, data: { [field]: newValue } });
  return User.userFromPrisma(updatedUser);
};
