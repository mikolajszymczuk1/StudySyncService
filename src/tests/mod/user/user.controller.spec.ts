import type { Express } from 'express';
import request from 'supertest';
import pgClient from '@/db/pgClient';
import { createApp } from '@/app';
import { getEnvConfig } from '@/conf/configLoader';
import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import { createUserBO } from '@/mod/auth/authBO';
import bcrypt from 'bcrypt';
import { createToken } from '@/utils/tokenHelpers';
import User from '@/mod/auth/model/User';

describe('User controller', (): void => {
  let app: Express | null;
  let user: User;

  beforeAll(async (): Promise<void> => {
    app = createApp(getEnvConfig('local'));
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    user = await createUserBO('testUser', passwordHash);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
    app = null;
  });

  describe('[PUT] /api/user/updateData', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .put('/api/user/updateData')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ field: 'firstName' });

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
          path: 'userId',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value should be a number',
          path: 'userId',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'newValue',
          location: 'body',
        },
      ]);
    });

    it('Should correctly update user data', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .put('/api/user/updateData')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, field: 'firstName', newValue: 'someValue' });

      // When
      const status = response.status;
      const updatedUserData = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.OK);
      expect(updatedUserData.firstName).toBe('someValue');
    });

    it('Should let client only send field values : [firstName, lastName]', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .put('/api/user/updateData')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, field: 'something', newValue: 'test' });

      // When
      const status = response.status;
      const error = response.body.error;

      // Then
      expect(status).toEqual(StatusCodesEnum.BadRequest);
      expect(error).toBe('Field value can be only: [firstName, lastName]');
    });
  });
});
