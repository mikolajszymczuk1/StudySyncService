import { fieldValidString } from '@/middleware/validators/commonValidators';

export const loginValidators = [fieldValidString('username'), fieldValidString('password')];

export const registerValidators = [
  fieldValidString('username'),
  fieldValidString('password'),
  fieldValidString('repeatPassword'),
];
