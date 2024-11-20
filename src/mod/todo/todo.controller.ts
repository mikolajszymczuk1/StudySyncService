import type { Request, Response } from 'express';
import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import {
  getTodosBO,
  createTodoBO,
  updateTodoBO,
  removeTodoBO,
  changeTodoStatusBO,
  reorderTodoBO,
} from '@/mod/todo/todoBO';

/**
 * Get all todos action
 * @param {Request} req request
 * @param {Response} res response
 */
export const getTodosAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const todos = await getTodosBO(Number(userId));
    res.status(StatusCodesEnum.OK).json(todos);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Create todo action
 * @param {Request} req request
 * @param {Response} res response
 */
export const createTodoAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, order } = req.body;

    const createdTodo = await createTodoBO(Number(userId), name, Number(order));
    res.status(StatusCodesEnum.NewResources).json(createdTodo);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Update todo action
 * @param {Request} req request
 * @param {Response} res response
 */
export const updateTodoAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { todoId } = req.params;
    const { userId, name } = req.body;

    const updatedTodo = await updateTodoBO(Number(todoId), Number(userId), name);
    res.status(StatusCodesEnum.NewResources).json(updatedTodo);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Remove todo action
 * @param {Request} req request
 * @param {Response} res response
 */
export const removeTodoAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { todoId } = req.params;
    const { userId } = req.body;

    const removedTodo = await removeTodoBO(Number(todoId), Number(userId));
    res.status(StatusCodesEnum.NewResources).json(removedTodo);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Change status for todo action
 * @param {Request} req request
 * @param {Response} res response
 */
export const changeStatusTodoAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { todoId } = req.params;
    const { userId, isComplete } = req.body;

    const updatedTodo = await changeTodoStatusBO(Number(todoId), Number(userId), isComplete === 'true');
    res.status(StatusCodesEnum.NewResources).json(updatedTodo);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Reorder todo action
 * @param {Request} req request
 * @param {Response} res response
 */
export const reorderTodoAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { todoId } = req.params;
    const { userId, order } = req.body;

    const updatedTodo = await reorderTodoBO(Number(todoId), Number(userId), Number(order));
    res.status(StatusCodesEnum.NewResources).json(updatedTodo);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};
