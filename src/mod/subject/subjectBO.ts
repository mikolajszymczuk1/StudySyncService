import Subject from '@/mod/subject/model/Subject';
import {
  getSubjectsDAO,
  createSubjectDAO,
  updateSubjectDAO,
  removeSubjectDAO,
  changeSubjectDayDAO,
  changeSubjectGradeDAO,
} from '@/mod/subject/subjectDAO';

export const getSubjectsBO = async (userId: number): Promise<Subject[]> => {
  return await getSubjectsDAO(userId);
};

export const createSubjectBO = async (
  userId: number,
  name: string,
  startTime: string,
  endTime: string,
  evenOdd: string,
  classNumber: string,
  day: string,
): Promise<Subject> => {
  return await createSubjectDAO(userId, name, startTime, endTime, evenOdd, classNumber, day);
};

export const updateSubjectBO = async (
  subjectId: number,
  userId: number,
  name: string,
  startTime: string,
  endTime: string,
  evenOdd: string,
  classNumber: string,
  day: string,
): Promise<Subject> => {
  return await updateSubjectDAO(subjectId, userId, name, startTime, endTime, evenOdd, classNumber, day);
};

export const removeSubjectBO = async (subjectId: number, userId: number): Promise<Subject> => {
  return await removeSubjectDAO(subjectId, userId);
};

export const changeSubjectDayBO = async (subjectId: number, userId: number, day: string): Promise<Subject> => {
  return await changeSubjectDayDAO(subjectId, userId, day);
};

export const changeSubjectGradeBO = async (subjectId: number, userId: number, grade: number): Promise<Subject> => {
  return await changeSubjectGradeDAO(subjectId, userId, grade);
};
