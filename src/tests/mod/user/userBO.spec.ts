import pgClient from '@/db/pgClient';
import bcrypt from 'bcrypt';
import { createUserBO } from '@/mod/auth/authBO';
import { updateUserDataBO } from '@/mod/user/userBO';
import User from '@/mod/auth/model/User';

describe('User BO', (): void => {
  let user: User;

  beforeAll(async (): Promise<void> => {
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    user = await createUserBO('testUser', passwordHash);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
  });

  describe('updateUserDataBO', (): void => {
    it('Should update user data correctly', async (): Promise<void> => {
      // Given
      const id = user.id;
      const field = 'firstName';
      const newValue = 'cat';

      // When
      const result = await updateUserDataBO(id, field, newValue);

      // Then
      expect(result?.firstName).toBe(newValue);
    });

    it("For 'field' Should allow only values : [firstName, lastName]", async (): Promise<void> => {
      // Given
      const id = user.id;
      const field = 'test';
      const newValue = '666';

      // When
      const result = await updateUserDataBO(id, field, newValue);

      // Then
      expect(result).toBeNull();
    });
  });
});
