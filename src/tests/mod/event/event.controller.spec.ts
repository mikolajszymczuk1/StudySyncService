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
import Event from '@/mod/event/model/Event';
import { createTestEvent } from '@/utils/dbHelpers';
import { getEventsBO } from '@/mod/event/eventBO';

describe('Event controller', (): void => {
  let app: Express | null;
  let user: User;
  let event1: Event;
  let event2: Event;

  beforeAll(async (): Promise<void> => {
    app = createApp(getEnvConfig('local'));
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    user = await createUserBO('testUser', passwordHash);
  });

  beforeEach(async (): Promise<void> => {
    await pgClient.event.deleteMany();

    event1 = new Event(-1, 'Some event 1', 0, user.id);
    event2 = new Event(-1, 'Some event 2', 0, user.id);

    // Create some events for test
    event1.id = await createTestEvent(event1);
    event2.id = await createTestEvent(event2);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
    app = null;
  });

  describe('[GET] /api/event/:userId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .get('/api/event/cat')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' });

      // When
      const status = response.status;
      const errors = response.body.errors;

      // Then
      expect(status).toEqual(StatusCodesEnum.ResourceForbidden);
      expect(errors).toEqual([
        {
          type: 'field',
          value: 'cat',
          msg: 'Value should be a number',
          path: 'userId',
          location: 'params',
        },
      ]);
    });

    it('Should return all user events', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .get(`/api/event/${user.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.OK);
      expect(body.length).toBe(2);
      expect(body).toMatchObject([event1, event2]);
    });
  });

  describe('[POST] /api/event', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const name: string = '';

      const response = await request(app!)
        .post('/api/event')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, name });

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
          path: 'name',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'eventDate',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value should be a number',
          path: 'eventDate',
          location: 'body',
        },
      ]);
    });

    it('Should create new event', async (): Promise<void> => {
      // Given
      const newEvent: Event = new Event(-1, 'new event', 0, user.id);

      const response = await request(app!)
        .post('/api/event')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: newEvent.userId, name: newEvent.name, eventDate: newEvent.eventDate });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      newEvent.id = body.id;
      expect(body).toMatchObject(newEvent);
    });
  });

  describe('[PUT] /api/event/:eventId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const name: string = '';

      const response = await request(app!)
        .put('/api/event/cat')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, name });

      // When
      const status = response.status;
      const errors = response.body.errors;

      // Then
      expect(status).toEqual(StatusCodesEnum.ResourceForbidden);
      expect(errors).toEqual([
        {
          type: 'field',
          value: 'cat',
          msg: 'Value should be a number',
          path: 'eventId',
          location: 'params',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'name',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'eventDate',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value should be a number',
          path: 'eventDate',
          location: 'body',
        },
      ]);
    });

    it('Should update event', async (): Promise<void> => {
      // Given
      event1.name = 'updated event';

      const response = await request(app!)
        .put(`/api/event/${event1.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: event1.userId, name: event1.name, eventDate: event1.eventDate });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      expect(body).toMatchObject(event1);
    });
  });

  describe('[DELETE] /api/event/:eventId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .delete('/api/event/cat')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' });

      // When
      const status = response.status;
      const errors = response.body.errors;

      // Then
      expect(status).toEqual(StatusCodesEnum.ResourceForbidden);
      expect(errors).toEqual([
        {
          type: 'field',
          value: 'cat',
          msg: 'Value should be a number',
          path: 'eventId',
          location: 'params',
        },
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
      ]);
    });

    it('Should delete event', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .delete(`/api/event/${event1.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: event1.userId });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      expect(body).toMatchObject(event1);
      const eventsAfter = await getEventsBO(user.id);
      expect(eventsAfter.length).toBe(1);
    });
  });
});
