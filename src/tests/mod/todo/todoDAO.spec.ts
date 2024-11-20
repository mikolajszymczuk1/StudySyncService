import pgClient from '@/db/pgClient';
import bcrypt from 'bcrypt';
import { createUserBO } from '@/mod/auth/authBO';
import {
  getTodosDAO,
  getSingleTodoDAO,
  createTodoDAO,
  updateTodoDAO,
  removeTodoDAO,
  changeTodoStatusDAO,
  reorderTodoDAO,
  shiftUpTodosDAO,
  shiftDownTodosDAO,
} from '@/mod/todo/todoDAO';
import { getTodosBO } from '@/mod/todo/todoBO';
import User from '@/mod/auth/model/User';
import Todo from '@/mod/todo/model/Todo';
import { createTestTodo } from '@/utils/dbHelpers';

describe('Todo DAO', (): void => {
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

  describe('getTodosDAO', (): void => {
    it('Should return all user todos', async (): Promise<void> => {
      // Given
      const id: number = user.id;

      // When
      const result = await getTodosDAO(id);

      // Then
      expect(result.length).toBe(2);
      expect(result).toMatchObject([todo1, todo2]);
    });
  });

  describe('getSingleTodoDAO', (): void => {
    it('Should return specific todo element', async (): Promise<void> => {
      // Given
      const id: number = user.id;

      // When
      const result = await getSingleTodoDAO(todo1.id, id);

      // Then
      expect(result).toMatchObject(todo1);
    });
  });

  describe('createTodoDAO', (): void => {
    it('Should create new todo', async (): Promise<void> => {
      // Given
      const id: number = user.id;
      const newTodo = new Todo(-1, 'new todo', false, 3, id);

      // When
      const result = await createTodoDAO(id, newTodo.name, newTodo.order);

      // Then
      newTodo.id = result.id;
      expect(result).toMatchObject(newTodo);
    });
  });

  describe('updateTodoDAO', (): void => {
    it('Should update todo', async (): Promise<void> => {
      // Given
      const id = user.id;
      const todoId = todo1.id;
      todo1.name = 'changed name';

      // When
      const result = await updateTodoDAO(todoId, id, todo1.name);

      // Then
      expect(result).toMatchObject(todo1);
      expect(result.name).toBe('changed name');
    });
  });

  describe('removeTodoDAO', (): void => {
    it('Should remove todo', async (): Promise<void> => {
      // Given
      const id = user.id;
      const todoId = todo1.id;
      const resultBefore = await getTodosBO(id);

      // When
      const result = await removeTodoDAO(todoId, id);

      // Then
      const resultAfter = await getTodosBO(id);
      expect(result).toMatchObject(todo1);
      expect(resultBefore.length).toBe(2);
      expect(resultAfter.length).toBe(1);
    });
  });

  describe('changeTodoStatusDAO', (): void => {
    it('Should change status value for todo', async (): Promise<void> => {
      // Given
      const id = user.id;
      const todoId = todo1.id;
      const isComplete = true;
      todo1.isComplete = isComplete;

      // When
      const result = await changeTodoStatusDAO(todoId, id, isComplete);

      // Then
      expect(result).toMatchObject(todo1);
    });
  });

  describe('reorderTodoDAO', (): void => {
    it('Should change order value for todo', async (): Promise<void> => {
      // Given
      const id = user.id;
      const todoId = todo1.id;
      const order = todo2.order;
      const oldOrder = todo1.order;
      todo1.order = order;
      todo2.order = oldOrder;

      // When
      const result1 = await reorderTodoDAO(todoId, id, order);
      const result2 = await reorderTodoDAO(todo2.id, id, oldOrder);

      // Then
      expect(result1).toMatchObject(todo1);
      expect(result2).toMatchObject(todo2);
    });
  });

  describe('shiftUpTodosDAO', (): void => {
    it('Should increment order value for todos where order value is greater or equal given new order value AND less then current order value', async (): Promise<void> => {
      // Given
      const order = 1;
      const currentOrder = 2;

      // When
      await shiftUpTodosDAO(user.id, order, currentOrder);

      // Then
      const todos = await getTodosBO(user.id);
      todos.forEach((todo) => {
        expect(todo.order).toBe(2);
      });
    });
  });

  describe('shiftDownTodosDAO', (): void => {
    it('Should decrement order value for todos where order value is greater then current order value AND less or equal new order value', async (): Promise<void> => {
      // Given
      const order = 2;
      const currentOrder = 1;

      // When
      await shiftDownTodosDAO(user.id, order, currentOrder);

      // Then
      const todos = await getTodosBO(user.id);
      todos.forEach((todo) => {
        expect(todo.order).toBe(1);
      });
    });
  });
});
