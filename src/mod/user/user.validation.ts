import { fieldValidNumber, fieldValidString } from '@/middleware/validators/commonValidators';

export const updateDataValidators = [
  fieldValidNumber('userId'),
  fieldValidString('field'),
  fieldValidString('newValue'),
];
