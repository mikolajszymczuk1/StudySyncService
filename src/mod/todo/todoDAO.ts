import pgClient from '@/db/pgClient';
import Todo from '@/mod/todo/model/Todo';

/**
 * Retrieves the list of todos for a specific user.
 * @param {number} userId The ID of the user whose todos are to be retrieved.
 * @returns {Promise<Todo[]>} Array of user todos
 */
export const getTodosDAO = async (userId: number): Promise<Todo[]> => {
  const todos = await pgClient.todo.findMany({ where: { userId } });
  return todos.map((todo) => Todo.todoFromPrisma(todo));
};

/**
 * Creates a new todo for a specific user.
 * @param {number} userId The ID of the user for whom the todo is being created.
 * @param {string} name The name or title of the todo.
 * @param {number} order The order or priority of the todo.
 * @returns {Promise<Todo>} Created todo object
 */
export const createTodoDAO = async (userId: number, name: string, order: number): Promise<Todo> => {
  const todo = await pgClient.todo.create({
    data: { userId, name, order, isComplete: false },
  });
  return Todo.todoFromPrisma(todo);
};

/**
 * Updates the details of an existing todo for a specific user.
 * @param {number} todoId The ID of the todo to update.
 * @param {number} userId The ID of the user who owns the todo.
 * @param {string} name The new name or title of the todo.
 * @returns {Promise<Todo>} Updated todo object
 */
export const updateTodoDAO = async (todoId: number, userId: number, name: string): Promise<Todo> => {
  const todo = await pgClient.todo.update({
    where: { id: todoId, userId: userId },
    data: { name },
  });
  return Todo.todoFromPrisma(todo);
};

/**
 * Removes a todo for a specific user.
 * @param {number} todoId The ID of the todo to be removed.
 * @param {number} userId The ID of the user who owns the todo.
 * @returns {Promise<Todo>} Removed todo object
 */
export const removeTodoDAO = async (todoId: number, userId: number): Promise<Todo> => {
  const todo = await pgClient.todo.delete({ where: { id: todoId, userId } });
  return Todo.todoFromPrisma(todo);
};

/**
 * Changes the completion status of a todo for a specific user.
 * @param {number} todoId The ID of the todo whose status is to be changed.
 * @param {number} userId The ID of the user who owns the todo.
 * @param {boolean} isComplete The new completion status of the todo.
 * @returns {Promise<Todo>} Updated todo object
 */
export const changeTodoStatusDAO = async (todoId: number, userId: number, isComplete: boolean): Promise<Todo> => {
  const todo = await pgClient.todo.update({
    where: { id: todoId, userId },
    data: { isComplete },
  });
  return Todo.todoFromPrisma(todo);
};

/**
 * Reorders a todo for a specific user.
 * @param {number} todoId The ID of the todo to be reordered.
 * @param {number} userId The ID of the user who owns the todo.
 * @param {number} order The new order or priority of the todo.
 * @returns {Promise<Todo>} Updated todo object
 */
export const reorderTodoDAO = async (todoId: number, userId: number, order: number): Promise<Todo> => {
  const todo = await pgClient.todo.update({
    where: { id: todoId, userId },
    data: { order },
  });
  return Todo.todoFromPrisma(todo);
};

/**
 * Get todo by order value
 * @param userId The ID of user who owns the todo
 * @param order The order value
 * @returns {Promise<Todo>} Todo object
 */
export const getTodoByOrderDAO = async (userId: number, order: number): Promise<Todo> => {
  const todo = (await pgClient.todo.findFirst({ where: { userId, order } })) as Todo;
  return Todo.todoFromPrisma(todo);
};
