import type { Express } from 'express';
import request from 'supertest';
import pgClient from '@/db/pgClient';
import { createApp } from '@/app';
import { getEnvConfig } from '@/conf/configLoader';
import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import { createUserBO, getUserBO } from '@/mod/auth/authBO';
import bcrypt from 'bcrypt';
import { createToken } from '@/utils/tokenHelpers';

describe('Auth controller', (): void => {
  let app: Express | null;

  beforeAll(async (): Promise<void> => {
    app = createApp(getEnvConfig('local'));
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    await createUserBO('testUser', passwordHash);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
    app = null;
  });

  describe('[POST] /api/auth/login', (): void => {
    it('All inputs are required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ username: '', password: '' });

      // When
      const status = response.status;
      const errors = response.body.errors;

      // Then
      expect(status).toEqual(StatusCodesEnum.ResourceForbidden);
      expect(errors).toEqual([
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'username',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'password',
          location: 'body',
        },
      ]);
    });

    it('Wrong login or password', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ username: 'test', password: 'test' });

      // When
      const status = response.status;
      const error = response.body.error;

      // Then
      expect(status).toEqual(StatusCodesEnum.BadRequest);
      expect(error).toBe('Wrong username or password !');
    });

    it('If username and password correct, login user', async () => {
      // Given
      const response = await request(app!)
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ username: 'testUser', password: 'password' });

      // When
      const status = response.status;

      // Then
      expect(status).toEqual(StatusCodesEnum.OK);
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe('[POST] /api/auth/register', (): void => {
    it('All inputs are required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/auth/register')
        .set('Accept', 'application/json')
        .send({ username: '', password: '', repeatPassword: '' });

      // When
      const status = response.status;
      const errors = response.body.errors;

      // Then
      expect(status).toEqual(StatusCodesEnum.ResourceForbidden);
      expect(errors).toEqual([
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'username',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'password',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'repeatPassword',
          location: 'body',
        },
      ]);
    });

    it('Password and repeat password are not the same', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/auth/register')
        .set('Accept', 'application/json')
        .send({ username: 'testUser', password: 'test', repeatPassword: 'wrong' });

      // When
      const status = response.status;
      const error = response.body.error;

      // Then
      expect(status).toEqual(StatusCodesEnum.ResourceConflict);
      expect(error).toBe('Password and repeat password are not the same !');
    });

    it('User already exists', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/auth/register')
        .set('Accept', 'application/json')
        .send({ username: 'testUser', password: 'test', repeatPassword: 'test' });

      // When
      const status = response.status;
      const error = response.body.error;

      // Then
      expect(status).toEqual(StatusCodesEnum.ResourceConflict);
      expect(error).toBe('User already exists !');
    });

    it('If all data are correct, register user', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/auth/register')
        .set('Accept', 'application/json')
        .send({ username: 'newUser', password: 'test', repeatPassword: 'test' });

      // When

      // Then
      expect(response.status).toEqual(StatusCodesEnum.NewResources);
      const user = await getUserBO('newUser');
      expect(user).toBeDefined();
      expect(user?.username).toBe('newUser');
      expect(bcrypt.compareSync('test', user?.passwordHash!)).toBeTruthy();
      expect(user?.firstName).toBe('First Name');
      expect(user?.lastName).toBe('Last Name');
    });
  });

  describe('[POST] /api/auth/logout', (): void => {
    it('Should logout successfully', async (): Promise<void> => {
      // Given
      const response = await request(app!).post('/api/auth/logout').set('Accept', 'application/json');

      // When
      const status = response.status;
      const msg = response.body.msg;

      // Then
      expect(status).toEqual(StatusCodesEnum.OK);
      expect(msg).toEqual('Logout successfully !');
    });
  });

  describe('[GET] /api/auth/session', (): void => {
    it('If token is incorrect, should not return session data', async (): Promise<void> => {
      // Given
      const token = 'abcdefg';
      const response = await request(app!)
        .get('/api/auth/session')
        .set('Authorization', 'Bearer token')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      // When
      const status = response.status;

      // Then
      expect(status).toEqual(StatusCodesEnum.Unauthorized);
    });

    it('If token is correct, should return session successfully', async (): Promise<void> => {
      // Given
      const user = await getUserBO('testUser');
      const token = createToken(user!);
      const response = await request(app!)
        .get('/api/auth/session')
        .set('Authorization', 'Bearer token')
        .set('Accept', 'application/json')
        .auth(token, { type: 'bearer' });

      // When
      const status = response.status;
      const responseUser = response.body.user;

      // Then
      expect(status).toEqual(StatusCodesEnum.OK);
      expect(responseUser).toEqual({
        id: user?.id,
        username: 'testUser',
        firstName: 'First Name',
        lastName: 'Last Name',
        createdAt: user?.createdAt,
      });
    });
  });
});
