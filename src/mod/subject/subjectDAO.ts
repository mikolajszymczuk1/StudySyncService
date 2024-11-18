import pgClient from '@/db/pgClient';
import Subject from '@/mod/subject/model/Subject';

/**
 * Get all user subjects
 * @param {number} userId userId
 * @returns {Promise<Subject[]>} subjects items
 */
export const getSubjectsDAO = async (userId: number): Promise<Subject[]> => {
  const subjects = await pgClient.subject.findMany({ where: { userId } });
  return subjects.map((subject) => Subject.subjectFromPrisma(subject));
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
 * @returns {Promise<Subject>}
 */
export const createSubjectDAO = async (
  userId: number,
  name: string,
  startTime: string,
  endTime: string,
  evenOdd: string,
  classNumber: string,
  day: string,
): Promise<Subject> => {
  const subject = await pgClient.subject.create({
    data: { userId, name, startTime, endTime, evenOdd, grade: 5, classNumber, day },
  });
  return Subject.subjectFromPrisma(subject);
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
export const updateSubjectDAO = async (
  subjectId: number,
  userId: number,
  name: string,
  startTime: string,
  endTime: string,
  evenOdd: string,
  classNumber: string,
  day: string,
): Promise<Subject> => {
  const subject = await pgClient.subject.update({
    where: { id: subjectId, userId: userId },
    data: { name, startTime, endTime, evenOdd, classNumber, day },
  });
  return Subject.subjectFromPrisma(subject);
};

/**
 * Remove subject
 * @param {number} subjectId subject id
 * @param {number} userId user id
 * @returns {Promise<Subject>} removed subject object
 */
export const removeSubjectDAO = async (subjectId: number, userId: number): Promise<Subject> => {
  const subject = await pgClient.subject.delete({ where: { id: subjectId, userId } });
  return Subject.subjectFromPrisma(subject);
};

/**
 * Change subject day value
 * @param {number} subjectId subject id
 * @param {number} userId user id
 * @param {string} day new day value
 * @returns {Promise<Subject>} updated subject object
 */
export const changeSubjectDayDAO = async (subjectId: number, userId: number, day: string): Promise<Subject> => {
  const subject = await pgClient.subject.update({ where: { id: subjectId, userId }, data: { day } });
  return Subject.subjectFromPrisma(subject);
};

/**
 * Change subject grade value
 * @param {number} subjectId subject id
 * @param {number} userId user id
 * @param {number} grade new grade value
 * @returns {Promise<Subject>} updated subject object
 */
export const changeSubjectGradeDAO = async (subjectId: number, userId: number, grade: number): Promise<Subject> => {
  const subject = await pgClient.subject.update({ where: { id: subjectId, userId }, data: { grade } });
  return Subject.subjectFromPrisma(subject);
};
