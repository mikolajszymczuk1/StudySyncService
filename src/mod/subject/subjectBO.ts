import Subject from '@/mod/subject/model/Subject';
import {
  getSubjectsDAO,
  createSubjectDAO,
  updateSubjectDAO,
  removeSubjectDAO,
  changeSubjectDayDAO,
  changeSubjectGradeDAO,
} from '@/mod/subject/subjectDAO';

/**
 * Get all user subjects
 * @param {number} userId userId
 * @returns {Promise<Subject[]>} subjects items
 */
export const getSubjectsBO = async (userId: number): Promise<Subject[]> => {
  return await getSubjectsDAO(userId);
};

/**
 * Create new subject
 * @param {number} userId user id
 * @param {string} name name of subject
 * @param {string} startTime start time
 * @param {string} endTime end time
 * @param {string} evenOdd even or odd
 * @param {string} classNumber class number / class room name
 * @param {string} day day name
 * @returns {Promise<Subject>} created subject object
 */
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

/**
 * Update subject data
 * @param {number} subjectId subject id
 * @param {number} userId user id
 * @param {string} name name of subject
 * @param {string} startTime start time
 * @param {string} endTime end time
 * @param {string} evenOdd even or odd
 * @param {string} classNumber class number / class room name
 * @param {string} day day name
 * @returns {Promise<Subject>} updated subject object
 */
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

/**
 * Remove subject
 * @param {number} subjectId subject id
 * @param {number} userId user id
 * @returns {Promise<Subject>} removed subject object
 */
export const removeSubjectBO = async (subjectId: number, userId: number): Promise<Subject> => {
  return await removeSubjectDAO(subjectId, userId);
};

/**
 * Change subject day value
 * @param {number} subjectId subject id
 * @param {number} userId user id
 * @param {string} day new day value
 * @returns {Promise<Subject>} updated subject object
 */
export const changeSubjectDayBO = async (subjectId: number, userId: number, day: string): Promise<Subject> => {
  return await changeSubjectDayDAO(subjectId, userId, day);
};

/**
 * Change subject grade value
 * @param {number} subjectId subject id
 * @param {number} userId user id
 * @param {number} grade new grade value
 * @returns {Promise<Subject>} updated subject object
 */
export const changeSubjectGradeBO = async (subjectId: number, userId: number, grade: number): Promise<Subject> => {
  return await changeSubjectGradeDAO(subjectId, userId, grade);
};
