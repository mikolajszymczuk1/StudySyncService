import pgClient from '@/db/pgClient';
import Subject from '@/mod/subject/model/Subject';

export const getSubjectsDAO = async (userId: number): Promise<Subject[]> => {
  const subjects = await pgClient.subject.findMany({ where: { userId } });
  return subjects.map((subject) => Subject.subjectFromPrisma(subject));
};

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

export const removeSubjectDAO = async (subjectId: number, userId: number): Promise<Subject> => {
  const subject = await pgClient.subject.delete({ where: { id: subjectId, userId } });
  return Subject.subjectFromPrisma(subject);
};

export const changeSubjectDayDAO = async (subjectId: number, userId: number, day: string): Promise<Subject> => {
  const subject = await pgClient.subject.update({ where: { id: subjectId, userId }, data: { day } });
  return Subject.subjectFromPrisma(subject);
};

export const changeSubjectGradeDAO = async (subjectId: number, userId: number, grade: number): Promise<Subject> => {
  const subject = await pgClient.subject.update({ where: { id: subjectId, userId }, data: { grade } });
  return Subject.subjectFromPrisma(subject);
};
