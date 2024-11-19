import express, { type Router } from 'express';
import {
  getTodosAction,
  createTodoAction,
  updateTodoAction,
  removeTodoAction,
  changeStatusTodoAction,
  reorderTodoAction,
} from '@/mod/todo/todo.controller';
import { verifyToken } from '@/middleware/auth';
import { validRequest } from '@/middleware/validators/commonValidators';
import {
  getTodosValidators,
  createTodoValidators,
  updateTodoValidators,
  removeTodoValidators,
  changeStatusTodoValidator,
  reorderTodoValidators,
} from '@/mod/todo/todo.validation';

const todoRouter: Router = express.Router();

todoRouter.get('/:userId', [verifyToken, ...getTodosValidators, validRequest], getTodosAction);

todoRouter.post('/', [verifyToken, ...createTodoValidators, validRequest], createTodoAction);

todoRouter.put('/:todoId', [verifyToken, ...updateTodoValidators, validRequest], updateTodoAction);

todoRouter.delete('/:todoId', [verifyToken, ...removeTodoValidators, validRequest], removeTodoAction);

todoRouter.post(
  '/changeStatus/:todoId',
  [verifyToken, ...changeStatusTodoValidator, validRequest],
  changeStatusTodoAction,
);

todoRouter.post('/reorder/:todoId', [verifyToken, ...reorderTodoValidators, validRequest], reorderTodoAction);

export default todoRouter;
