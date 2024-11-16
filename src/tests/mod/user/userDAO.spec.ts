import pgClient from '@/db/pgClient';
import bcrypt from 'bcrypt';
import { createUserBO, getUserBO } from '@/mod/auth/authBO';
import { updateUserDataDAO } from '@/mod/user/userDAO';
import User from '@/mod/auth/model/User';

describe('User DAO', (): void => {
  let user: User;

  beforeAll(async (): Promise<void> => {
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    user = await createUserBO('testUser', passwordHash);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
  });

  describe('updateUserDataDAO', (): void => {
    it('Should update user data correctly', async (): Promise<void> => {
      // Given
      const id = user.id;
      const field = 'firstName';
      const newValue = 'test';

      // When
      const result = await updateUserDataDAO(id, field, newValue);

      // Then
      expect(result?.firstName).toBe(newValue);
      const updatedUser = await getUserBO(user.username);
      expect(updatedUser?.firstName).toBe(newValue);
    });
  });
});
