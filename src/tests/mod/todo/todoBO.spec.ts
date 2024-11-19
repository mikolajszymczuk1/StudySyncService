import pgClient from '@/db/pgClient';
import bcrypt from 'bcrypt';
import { createUserBO } from '@/mod/auth/authBO';
import {
  getTodosBO,
  createTodoBO,
  updateTodoBO,
  removeTodoBO,
  changeTodoStatusBO,
  reorderTodoBO,
} from '@/mod/todo/todoBO';
import User from '@/mod/auth/model/User';
import Todo from '@/mod/todo/model/Todo';
import { createTestTodo } from '@/utils/dbHelpers';
import { getTodoByOrderDAO } from '@/mod/todo/todoDAO';

describe('Todo BO', (): void => {
  let user: User;
  let todo1: Todo;
  let todo2: Todo;

  beforeAll(async (): Promise<void> => {
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
  });

  describe('getTodosBO', (): void => {
    it('Should return all user todos', async (): Promise<void> => {
      // Given
      const id: number = user.id;

      // When
      const result = await getTodosBO(id);

      // Then
      expect(result.length).toBe(2);
      expect(result).toMatchObject([todo1, todo2]);
    });
  });

  describe('createTodoBO', (): void => {
    it('Should create new todo', async (): Promise<void> => {
      // Given
      const id: number = user.id;
      const newTodo = new Todo(-1, 'new todo', false, 3, id);

      // When
      const result = await createTodoBO(id, newTodo.name, newTodo.order);

      // Then
      newTodo.id = result.id;
      expect(result).toMatchObject(newTodo);
    });
  });

  describe('updateTodoBO', (): void => {
    it('Should update todo', async (): Promise<void> => {
      // Given
      const id = user.id;
      const todoId = todo1.id;
      todo1.name = 'changed name';

      // When
      const result = await updateTodoBO(todoId, id, todo1.name);

      // Then
      expect(result).toMatchObject(todo1);
      expect(result.name).toBe('changed name');
    });
  });

  describe('removeTodoBO', (): void => {
    it('Should remove todo', async (): Promise<void> => {
      // Given
      const id = user.id;
      const todoId = todo1.id;
      const resultBefore = await getTodosBO(id);

      // When
      const result = await removeTodoBO(todoId, id);

      // Then
      const resultAfter = await getTodosBO(id);
      expect(result).toMatchObject(todo1);
      expect(resultBefore.length).toBe(2);
      expect(resultAfter.length).toBe(1);
    });
  });

  describe('changeTodoStatusBO', (): void => {
    it('Should change status value for todo', async (): Promise<void> => {
      // Given
      const id = user.id;
      const todoId = todo1.id;
      const isComplete = true;
      todo1.isComplete = isComplete;

      // When
      const result = await changeTodoStatusBO(todoId, id, isComplete);

      // Then
      expect(result).toMatchObject(todo1);
    });
  });

  describe('reorderTodoBO', (): void => {
    it('Should change order value for todo', async (): Promise<void> => {
      // Given
      const id = user.id;
      const todoId = todo1.id;
      const order = todo2.order;
      const oldOrder = todo1.order;
      todo1.order = order;
      todo2.order = oldOrder;

      // When
      const result = await reorderTodoBO(todoId, id, order, oldOrder);

      // Then
      expect(result).toMatchObject(todo1);
      expect(await getTodoByOrderDAO(id, todo2.order)).toMatchObject(todo2);
    });
  });
});
