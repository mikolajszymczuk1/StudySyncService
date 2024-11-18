import type { Request, Response } from 'express';
import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import {
  getSubjectsBO,
  createSubjectBO,
  updateSubjectBO,
  removeSubjectBO,
  changeSubjectDayBO,
  changeSubjectGradeBO,
} from '@/mod/subject/subjectBO';

/**
 * Get all subjects action
 * @param {Request} req request
 * @param {Response} res response
 */
export const getSubjectsAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const subjects = await getSubjectsBO(Number(userId));
    res.status(StatusCodesEnum.OK).json(subjects);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Create subject action
 * @param {Request} req request
 * @param {Response} res response
 */
export const createSubjectAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, startTime, endTime, evenOdd, classNumber, day } = req.body;

    const createdSubject = await createSubjectBO(Number(userId), name, startTime, endTime, evenOdd, classNumber, day);
    res.status(StatusCodesEnum.NewResources).json(createdSubject);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Update subject action
 * @param {Request} req request
 * @param {Response} res response
 */
export const updateSubjectAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const { userId, name, startTime, endTime, evenOdd, classNumber, day } = req.body;

    const updatedSubject = await updateSubjectBO(
      Number(subjectId),
      Number(userId),
      name,
      startTime,
      endTime,
      evenOdd,
      classNumber,
      day,
    );
    res.status(StatusCodesEnum.NewResources).json(updatedSubject);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Remove subject action
 * @param {Request} req request
 * @param {Response} res response
 */
export const removeSubjectAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const { userId } = req.body;

    const removedSubject = await removeSubjectBO(Number(subjectId), Number(userId));
    res.status(StatusCodesEnum.OK).json(removedSubject);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Change subject day action
 * @param {Request} req request
 * @param {Response} res response
 */
export const changeSubjectDayAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const { userId, day } = req.body;

    const updatedSubject = await changeSubjectDayBO(Number(subjectId), Number(userId), day);
    res.status(StatusCodesEnum.OK).json(updatedSubject);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Change subject grade action
 * @param {Request} req request
 * @param {Response} res response
 */
export const changeSubjectGradeAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId } = req.params;
    const { userId, grade } = req.body;

    const updatedSubject = await changeSubjectGradeBO(Number(subjectId), Number(userId), Number(grade));
    res.status(StatusCodesEnum.OK).json(updatedSubject);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};
