import Subject from '@/mod/subject/model/Subject';
import pgClient from '@/db/pgClient';

/**
 * Create test subject object (for tests only)
 * @param {Subject} subject subject object to take data from
 * @returns {number} created subject id
 */
export const createTestSubject = async (subject: Subject): Promise<number> => {
  const { id } = await pgClient.subject.create({
    data: {
      name: subject.name,
      startTime: subject.startTime,
      endTime: subject.endTime,
      evenOdd: subject.evenOdd,
      grade: subject.grade,
      classNumber: subject.classNumber,
      day: subject.day,
      userId: subject.userId,
    },
  });

  return id;
};
