import { fieldValidNumber, fieldValidString } from '@/middleware/validators/commonValidators';

export const getEventsValidators = [fieldValidNumber('userId')];

export const createEventValidators = [
  fieldValidNumber('userId'),
  fieldValidString('name'),
  fieldValidNumber('eventDate'),
];

export const updateEventValidators = [
  fieldValidNumber('eventId'),
  fieldValidNumber('userId'),
  fieldValidString('name'),
  fieldValidNumber('eventDate'),
];

export const removeEventValidators = [fieldValidNumber('eventId'), fieldValidNumber('userId')];
