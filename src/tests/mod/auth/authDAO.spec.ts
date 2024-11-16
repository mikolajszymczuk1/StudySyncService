import pgClient from '@/db/pgClient';
import { createUserBO } from '@/mod/auth/authBO';
import { createUserDAO, getUserByUsernameDAO } from '@/mod/auth/authDAO';
import bcrypt from 'bcrypt';

describe('Auth DAO', (): void => {
  beforeAll(async (): Promise<void> => {
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    await createUserBO('testUser', passwordHash);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
  });

  describe('getUserByUsernameDAO', (): void => {
    it('should return user object when username is correct or null', async (): Promise<void> => {
      // Given
      const username1 = 'testUser';
      const username2 = 'testUser2';

      // When
      const user1 = await getUserByUsernameDAO(username1);
      const user2 = await getUserByUsernameDAO(username2);

      // Then
      expect(user1?.username).toBe(username1);
      expect(user2).toBeNull();
    });
  });

  describe('createUserDAO', (): void => {
    it('should create user record in database', async (): Promise<void> => {
      // Given
      const username = 'user';
      const passwordHash = await bcrypt.hash('pass', 10);

      // When
      const user = await createUserDAO(username, passwordHash);

      // Then
      expect(user).toBeDefined();
      expect(user?.username).toBe(username);
      expect(bcrypt.compareSync('pass', user?.passwordHash!)).toBeTruthy();
      expect(user?.firstName).toBe('First Name');
      expect(user?.lastName).toBe('Last Name');
    });
  });
});
