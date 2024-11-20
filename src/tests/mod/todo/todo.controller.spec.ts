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
import Todo from '@/mod/todo/model/Todo';
import { createTestTodo } from '@/utils/dbHelpers';
import { getTodosBO } from '@/mod/todo/todoBO';

describe('Todo controller', (): void => {
  let app: Express | null;
  let user: User;
  let todo1: Todo;
  let todo2: Todo;

  beforeAll(async (): Promise<void> => {
    app = createApp(getEnvConfig('local'));
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    user = await createUserBO('testUser', passwordHash);
  });

  beforeEach(async (): Promise<void> => {
    await pgClient.todo.deleteMany();

    todo1 = new Todo(-1, 'Some todo 1', false, 1, user.id);
    todo2 = new Todo(-1, 'Some todo 2', true, 2, user.id);

    // Create some todos for test
    todo1.id = await createTestTodo(todo1);
    todo2.id = await createTestTodo(todo2);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
    app = null;
  });

  describe('[GET] /api/todo/:userId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .get('/api/todo/cat')
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

    it('Should return all user todos', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .get(`/api/todo/${user.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.OK);
      expect(body.length).toBe(2);
      expect(body).toMatchObject([todo1, todo2]);
    });
  });

  describe('[POST] /api/todo', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const name: string = '';

      const response = await request(app!)
        .post('/api/todo')
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
          path: 'order',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value should be a number',
          path: 'order',
          location: 'body',
        },
      ]);
    });

    it('Should create new todo', async (): Promise<void> => {
      // Given
      const newTodo: Todo = new Todo(-1, 'new todo', false, 3, user.id);

      const response = await request(app!)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: newTodo.userId, name: newTodo.name, order: newTodo.order });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      newTodo.id = body.id;
      expect(body).toMatchObject(newTodo);
    });
  });

  describe('[PUT] /api/todo/:todoId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const name: string = '';

      const response = await request(app!)
        .put('/api/todo/cat')
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
          path: 'todoId',
          location: 'params',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'name',
          location: 'body',
        },
      ]);
    });

    it('Should update todo', async (): Promise<void> => {
      // Given
      todo1.name = 'updated todo';

      const response = await request(app!)
        .put(`/api/todo/${todo1.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: todo1.userId, name: todo1.name, order: todo1.order });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      expect(body).toMatchObject(todo1);
    });
  });

  describe('[DELETE] /api/todo/:todoId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .delete('/api/todo/cat')
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
          path: 'todoId',
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

    it('Should delete todo', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .delete(`/api/todo/${todo1.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: todo1.userId });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      expect(body).toMatchObject(todo1);
      const todosAfter = await getTodosBO(user.id);
      expect(todosAfter.length).toBe(1);
    });
  });

  describe('[POST] /api/todo/changeStatus/:todoId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/todo/changeStatus/cat')
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
          path: 'todoId',
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
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'isComplete',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'value must be a boolean',
          path: 'isComplete',
          location: 'body',
        },
      ]);
    });

    it('Should change todo status', async (): Promise<void> => {
      // Given
      const newStatus = true;

      const response = await request(app!)
        .post(`/api/todo/changeStatus/${todo1.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: todo1.userId, isComplete: newStatus });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      expect(todo1.isComplete).toBeFalsy();
      expect(body.isComplete).toBeTruthy();
    });
  });

  describe('[POST] /api/todo/reorder/:todoId', (): void => {
    it('All data required', async (): Promise<void> => {
      // Given
      const response = await request(app!)
        .post('/api/todo/reorder/cat')
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
          path: 'todoId',
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
        {
          type: 'field',
          value: '',
          msg: 'Value must be not empty',
          path: 'order',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Value should be a number',
          path: 'order',
          location: 'body',
        },
      ]);
    });

    it('Should change order for todo', async (): Promise<void> => {
      // Given
      todo1.order = 2;
      todo2.order = 1;

      const response = await request(app!)
        .post(`/api/todo/reorder/${todo1.id}`)
        .set('Accept', 'application/json')
        .auth(createToken(user), { type: 'bearer' })
        .send({ userId: todo1.userId, order: 2 });

      // When
      const status = response.status;
      const body = response.body;

      // Then
      expect(status).toEqual(StatusCodesEnum.NewResources);
      expect(body).toMatchObject(todo1);
      const todos = await getTodosBO(todo1.userId);
      expect(todos).toMatchObject([todo2, todo1]);
    });
  });
});
