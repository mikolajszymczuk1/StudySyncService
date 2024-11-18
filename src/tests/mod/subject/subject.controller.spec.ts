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
import { getSubjectsBO } from '@/mod/subject/subjectBO';
import Subject from '@/mod/subject/model/Subject';

describe('Subject controller', (): void => {
  let app: Express | null;
  let user: User;
  let subject1: Subject;
  let subject2: Subject;

  beforeAll(async (): Promise<void> => {
    app = createApp(getEnvConfig('local'));
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    user = await createUserBO('testUser', passwordHash);

    subject1 = new Subject(1, 'Math', '8:00', '10:00', 'odd', 4, '1A', 'Monday', user.id);
    subject2 = new Subject(2, 'Physic', '10:00', '12:15', 'even', 3, '4F', 'Friday', user.id);

    // Create some subjects for test
    await pgClient.subject.createMany({
      data: [subject1, subject2],
    });
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
    app = null;
  });

  describe('[GET] /api/subject/:userId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .get('/api/subject/cat')
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

    it('Should return all user subjects', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .get(`/api/subject/${user.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.OK);
      expect(body).toMatchObject([subject1, subject2]);
    });
  });

  describe('[POST] /api/subject/', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const name: string = '';
      const startTime: string = '';
      const endTime: string = '';
      const evenOdd: string = '';
      const classNumber: string = '';
      const day: string = '';

      const response = await request(app!)
        .post(`/api/subject/`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, name, startTime, endTime, evenOdd, classNumber, day });

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
          path: 'startTime',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'endTime',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'evenOdd',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'classNumber',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'day',
          location: 'body',
        },
      ]);
    });

    it('Should create new subject', async (): Promise<void> => {
      // Given
      const name: string = 'newSubject';
      const startTime: string = '10:00';
      const endTime: string = '16:30';
      const evenOdd: string = 'even';
      const classNumber: string = '444';
      const day: string = 'Friday';

      const response = await request(app!)
        .post(`/api/subject/`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, name, startTime, endTime, evenOdd, classNumber, day });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      expect(body).toMatchObject({
        name,
        startTime,
        endTime,
        evenOdd,
        grade: 5,
        classNumber,
        day,
        userId: user.id,
      });
    });
  });

  describe('[PUT] /api/subject/:subjectId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const subjectId = 'cat';
      const name: string = '';
      const startTime: string = '';
      const endTime: string = '';
      const evenOdd: string = '';
      const classNumber: string = '';
      const day: string = '';

      const response = await request(app!)
        .put(`/api/subject/${subjectId}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, name, startTime, endTime, evenOdd, classNumber, day });

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
          path: 'subjectId',
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
          path: 'startTime',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'endTime',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'evenOdd',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'classNumber',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'day',
          location: 'body',
        },
      ]);
    });

    it('Should update exists subject', async (): Promise<void> => {
      // Given
      const name: string = 'updatedSubject';
      const startTime: string = '10:30';
      const endTime: string = '15:00';
      const evenOdd: string = 'odd';
      const classNumber: string = '555';
      const day: string = 'Saturday';
      const subjectBefore = (await getSubjectsBO(user.id)).find((subject) => subject.id === subject1.id);

      const response = await request(app!)
        .put(`/api/subject/${subject1.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, name, startTime, endTime, evenOdd, classNumber, day });

      // When
      const status = response.status;
      // const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      const subjectAfter = (await getSubjectsBO(user.id)).find((subject) => subject.id === subject1.id);
      expect(subjectBefore).toMatchObject(subject1);
      expect(subjectAfter).not.toMatchObject(subject1);
      expect(subjectAfter).toMatchObject({
        name,
        startTime,
        endTime,
        evenOdd,
        grade: subject1.grade,
        classNumber,
        day,
        userId: user.id,
      });
    });
  });

  describe('[DELETE] /api/subject/:subjectId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .delete('/api/subject/cat')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id });

      // When
      const status = response.status;
      const errors = response.body.errors;

      // Then
      expect(status).toBe(StatusCodesEnum.ResourceForbidden);
      expect(errors).toEqual([
        {
          type: 'field',
          value: 'cat',
          msg: 'Value should be a number',
          path: 'subjectId',
          location: 'params',
        },
      ]);
    });

    it('Should delete subject with specific id from database', async (): Promise<void> => {
      // Given
      const subjectsBefore = await getSubjectsBO(user.id);

      const response = await request(app!)
        .delete(`/api/subject/${subject1.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id });

      // When
      const status = response.status;

      // Then
      expect(status).toBe(StatusCodesEnum.OK);
      expect(subjectsBefore.length).toBe(3);
      const subjectsAfter = await getSubjectsBO(user.id);
      expect(subjectsAfter.length).toBe(2);
    });
  });

  describe('[POST] /api/subject/changeDay/:subjectId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/subject/changeDay/cat')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id });

      // When
      const status = response.status;
      const errors = response.body.errors;

      // Then
      expect(status).toBe(StatusCodesEnum.ResourceForbidden);
      expect(errors).toEqual([
        {
          type: 'field',
          value: 'cat',
          msg: 'Value should be a number',
          path: 'subjectId',
          location: 'params',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'day',
          location: 'body',
        },
      ]);
    });

    it('Should change day for specific subject', async (): Promise<void> => {
      // Given
      const newDay: string = 'Thursday';

      const response = await request(app!)
        .post(`/api/subject/changeDay/${subject2.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, day: newDay });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toBe(StatusCodesEnum.OK);
      expect(body.day).toBe(newDay);
    });
  });

  describe('[POST] /api/subject/changeGrade/:subjectId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/subject/changeGrade/cat')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id });

      // When
      const status = response.status;
      const errors = response.body.errors;

      // Then
      expect(status).toBe(StatusCodesEnum.ResourceForbidden);
      expect(errors).toEqual([
        {
          type: 'field',
          value: 'cat',
          msg: 'Value should be a number',
          path: 'subjectId',
          location: 'params',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'grade',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value should be a number',
          path: 'grade',
          location: 'body',
        },
      ]);
    });

    it('Should change grade for specific subject', async (): Promise<void> => {
      // Given
      const newGrade: number = 2;

      const response = await request(app!)
        .post(`/api/subject/changeGrade/${subject2.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: user.id, grade: newGrade });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toBe(StatusCodesEnum.OK);
      expect(body.grade).toBe(newGrade);
    });
  });
});
