import pgClient from '@/db/pgClient';
import bcrypt from 'bcrypt';
import { createUserBO, getUserBO } from '@/mod/auth/authBO';
import User from '@/mod/auth/model/User';

describe('Auth BO', (): void => {
  beforeAll(async (): Promise<void> => {
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    await createUserBO('testUser', passwordHash);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
  });

  describe('getUserBO', (): void => {
    it('When user with username exists, return them or return null', async (): Promise<void> => {
      // Given
      const username = 'testUser';

      // When
      const userByUsername = await getUserBO(username);

      // Then
      expect(userByUsername).toBeInstanceOf(User);
      expect(userByUsername?.username).toBe(username);
    });
  });

  describe('createUserBO', (): void => {
    it('should create new user', async (): Promise<void> => {
      // Given
      const username = 'user';
      const passwordHash = await bcrypt.hash('pass', 10);

      // When
      const user = await createUserBO(username, passwordHash);

      // Then
      expect(user).toBeDefined();
      expect(user?.username).toBe(username);
      expect(bcrypt.compareSync('pass', user?.passwordHash!)).toBeTruthy();
      expect(user?.firstName).toBe('First Name');
      expect(user?.lastName).toBe('Last Name');
    });
  });
});
