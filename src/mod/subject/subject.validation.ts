import { fieldValidString, fieldValidNumber } from '@/middleware/validators/commonValidators';

export const getSubjectsValidators = [fieldValidNumber('userId')];

export const createSubjectValidators = [
  fieldValidNumber('userId'),
  fieldValidString('name'),
  fieldValidString('startTime'),
  fieldValidString('endTime'),
  fieldValidString('evenOdd'),
  fieldValidString('classNumber'),
  fieldValidString('day'),
];

export const updateSubjectValidators = [
  fieldValidNumber('subjectId'),
  fieldValidNumber('userId'),
  fieldValidString('name'),
  fieldValidString('startTime'),
  fieldValidString('endTime'),
  fieldValidString('evenOdd'),
  fieldValidString('classNumber'),
  fieldValidString('day'),
];

export const removeSubjectValidators = [fieldValidNumber('subjectId'), fieldValidNumber('userId')];

export const changeSubjectDayValidators = [
  fieldValidNumber('subjectId'),
  fieldValidNumber('userId'),
  fieldValidString('day'),
];

export const changeSubjectGradeValidators = [
  fieldValidNumber('subjectId'),
  fieldValidNumber('userId'),
  fieldValidNumber('grade'),
];
