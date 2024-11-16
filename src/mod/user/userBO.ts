import { updateUserDataDAO } from '@/mod/user/userDAO';
import User from '@/mod/auth/model/User';

/**
 * Updated user base info like first name etc.
 * @param {number} userId user id
 * @param {string} field field to edit | Allowed values: `['firstName', 'lastName']`
 * @param {string} newValue new value for field
 * @returns {Promise<User> | null} Updated user object
 */
export const updateUserDataBO = async (userId: number, field: string, newValue: string): Promise<User | null> => {
  if (!['firstName', 'lastName'].includes(field)) {
    return null;
  }

  return await updateUserDataDAO(userId, field, newValue);
};
