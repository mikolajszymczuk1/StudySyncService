import pgClient from '@/db/pgClient';
import Todo from '@/mod/todo/model/Todo';
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

/**
 * Retrieves the list of todos for a specific user.
 * @param {number} userId The ID of the user whose todos are to be retrieved.
 * @returns {Promise<Todo[]>} Array of user todos
 */
export const getTodosBO = async (userId: number): Promise<Todo[]> => {
  return await getTodosDAO(userId);
};

/**
 * Creates a new todo for a specific user.
 * @param {number} userId The ID of the user for whom the todo is being created.
 * @param {string} name The name or title of the todo.
 * @param {number} order The order or priority of the todo.
 * @returns {Promise<Todo>} Created todo object
 */
export const createTodoBO = async (userId: number, name: string, order: number): Promise<Todo> => {
  return await createTodoDAO(userId, name, order);
};

/**
 * Updates the details of an existing todo for a specific user.
 * @param {number} todoId The ID of the todo to update.
 * @param {number} userId The ID of the user who owns the todo.
 * @param {string} name The new name or title of the todo.
 * @returns {Promise<Todo>} Updated todo object
 */
export const updateTodoBO = async (todoId: number, userId: number, name: string): Promise<Todo> => {
  return await updateTodoDAO(todoId, userId, name);
};

/**
 * Removes a todo for a specific user.
 * @param {number} todoId The ID of the todo to be removed.
 * @param {number} userId The ID of the user who owns the todo.
 * @returns {Promise<Todo>} Removed todo object
 */
export const removeTodoBO = async (todoId: number, userId: number): Promise<Todo> => {
  return await removeTodoDAO(todoId, userId);
};

/**
 * Changes the completion status of a todo for a specific user.
 * @param {number} todoId The ID of the todo whose status is to be changed.
 * @param {number} userId The ID of the user who owns the todo.
 * @param {boolean} isComplete The new completion status of the todo.
 * @returns {Promise<Todo>} Updated todo object
 */
export const changeTodoStatusBO = async (todoId: number, userId: number, isComplete: boolean): Promise<Todo> => {
  return await changeTodoStatusDAO(todoId, userId, isComplete);
};

/**
 * Reorders a todo for a specific user.
 * @param {number} todoId The ID of the todo to be reordered.
 * @param {number} userId The ID of the user who owns the todo.
 * @param {number} order The new order or priority of the todo.
 * @returns {Promise<Todo>} Updated todo object
 */
export const reorderTodoBO = async (todoId: number, userId: number, order: number): Promise<Todo> => {
  const result: Todo = await pgClient.$transaction(async (): Promise<Todo> => {
    const currentOrder = (await getSingleTodoDAO(todoId, userId)).order;

    if (order < currentOrder) {
      await shiftUpTodosDAO(userId, order, currentOrder);
    } else {
      await shiftDownTodosDAO(userId, order, currentOrder);
    }

    const updatedTodo = await reorderTodoDAO(todoId, userId, order);
    return updatedTodo;
  });

  return result;
};
