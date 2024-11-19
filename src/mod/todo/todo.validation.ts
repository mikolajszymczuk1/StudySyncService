import { fieldValidNumber, fieldValidString, fieldValidBoolean } from '@/middleware/validators/commonValidators';

export const getTodosValidators = [fieldValidNumber('userId')];

export const createTodoValidators = [fieldValidNumber('userId'), fieldValidString('name'), fieldValidNumber('order')];

export const updateTodoValidators = [fieldValidNumber('todoId'), fieldValidNumber('userId'), fieldValidString('name')];

export const removeTodoValidators = [fieldValidNumber('todoId'), fieldValidNumber('userId')];

export const changeStatusTodoValidator = [
  fieldValidNumber('todoId'),
  fieldValidNumber('userId'),
  fieldValidBoolean('isComplete'),
];

export const reorderTodoValidators = [
  fieldValidNumber('todoId'),
  fieldValidNumber('userId'),
  fieldValidNumber('order'),
  fieldValidNumber('oldOrder'),
];
