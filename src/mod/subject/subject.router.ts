import express, { type Router } from 'express';
import {
  getSubjectsAction,
  createSubjectAction,
  updateSubjectAction,
  removeSubjectAction,
  changeSubjectDayAction,
  changeSubjectGradeAction,
} from '@/mod/subject/subject.controller';
import { verifyToken } from '@/middleware/auth';
import { validRequest } from '@/middleware/validators/commonValidators';
import {
  getSubjectsValidators,
  createSubjectValidators,
  updateSubjectValidators,
  removeSubjectValidators,
  changeSubjectDayValidators,
  changeSubjectGradeValidators,
} from '@/mod/subject/subject.validation';

const subjectRouter: Router = express.Router();

subjectRouter.get('/:userId', [verifyToken, ...getSubjectsValidators, validRequest], getSubjectsAction);

subjectRouter.post('/', [verifyToken, ...createSubjectValidators, validRequest], createSubjectAction);

subjectRouter.put('/:subjectId', [verifyToken, ...updateSubjectValidators, validRequest], updateSubjectAction);

subjectRouter.delete('/:subjectId', [verifyToken, ...removeSubjectValidators, validRequest], removeSubjectAction);

subjectRouter.post(
  '/changeDay/:subjectId',
  [verifyToken, ...changeSubjectDayValidators, validRequest],
  changeSubjectDayAction,
);

subjectRouter.post(
  '/changeGrade/:subjectId',
  [verifyToken, ...changeSubjectGradeValidators, validRequest],
  changeSubjectGradeAction,
);

export default subjectRouter;
