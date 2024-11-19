import pgClient from '@/db/pgClient';
import bcrypt from 'bcrypt';
import { createUserBO } from '@/mod/auth/authBO';
import {
  getSubjectsBO,
  createSubjectBO,
  updateSubjectBO,
  removeSubjectBO,
  changeSubjectDayBO,
  changeSubjectGradeBO,
} from '@/mod/subject/subjectBO';
import User from '@/mod/auth/model/User';
import Subject from '@/mod/subject/model/Subject';
import { createTestSubject } from '@/utils/dbHelpers';

describe('Subject BO', (): void => {
  let user: User;
  let subject1: Subject;
  let subject2: Subject;

  beforeAll(async (): Promise<void> => {
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    user = await createUserBO('testUser', passwordHash);
  });

  beforeEach(async (): Promise<void> => {
    await pgClient.subject.deleteMany();
    subject1 = new Subject(-1, 'Math', '8:00', '10:00', 'odd', 4, '1A', 'Monday', user.id);
    subject2 = new Subject(-1, 'Physic', '10:00', '12:15', 'even', 3, '4F', 'Friday', user.id);

    // Create some subjects for test
    subject1.id = await createTestSubject(subject1);
    subject2.id = await createTestSubject(subject2);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
  });

  describe('getSubjectsBO', (): void => {
    it('Should return all user subjects', async (): Promise<void> => {
      // Given
      const id: number = user.id;

      // When
      const result = await getSubjectsBO(id);

      // Then
      expect(result.length).toBe(2);
      expect(result).toMatchObject([subject1, subject2]);
    });
  });

  describe('createSubjectBO', (): void => {
    it('Should create new subject', async (): Promise<void> => {
      // Given
      const id: number = user.id;
      const newSubject = new Subject(-1, 'newSubject', '10:00', '16:30', 'even', 5, '444', 'Friday', user.id);

      // When
      const result = await createSubjectBO(
        id,
        newSubject.name,
        newSubject.startTime,
        newSubject.endTime,
        newSubject.evenOdd,
        newSubject.classNumber,
        newSubject.day,
      );

      // Then
      newSubject.id = result.id;
      expect(result).toMatchObject(newSubject);
    });
  });

  describe('updateSubjectBO', (): void => {
    it('Should update subject', async (): Promise<void> => {
      // Given
      const id = user.id;
      const subjectId = subject1.id;
      subject1.name = 'changed name';

      // When
      const result = await updateSubjectBO(
        subjectId,
        id,
        subject1.name,
        subject1.startTime,
        subject1.endTime,
        subject1.evenOdd,
        subject1.classNumber,
        subject1.day,
      );

      // Then
      expect(result).toMatchObject(subject1);
      expect(result.name).toBe('changed name');
    });
  });

  describe('removeSubjectBO', (): void => {
    it('Should remove subject', async (): Promise<void> => {
      // Given
      const id = user.id;
      const subjectId = subject1.id;
      const resultBefore = await getSubjectsBO(id);

      // When
      const result = await removeSubjectBO(subjectId, id);

      // Then
      const resultAfter = await getSubjectsBO(id);
      expect(result).toMatchObject(subject1);
      expect(resultBefore.length).toBe(2);
      expect(resultAfter.length).toBe(1);
    });
  });

  describe('changeSubjectDayBO', (): void => {
    it('Should change day value for subject', async (): Promise<void> => {
      // Given
      const id = user.id;
      const subjectId = subject1.id;
      const newDay = 'Tuesday';
      subject1.day = newDay;

      // When
      const result = await changeSubjectDayBO(subjectId, id, newDay);

      // Then
      expect(result).toMatchObject(subject1);
    });
  });

  describe('changeSubjectGradeBO', (): void => {
    it('Should change grade value for subject', async (): Promise<void> => {
      // Given
      const id = user.id;
      const subjectId = subject1.id;
      const newGrade = 2;
      subject1.grade = newGrade;

      // When
      const result = await changeSubjectGradeBO(subjectId, id, newGrade);

      // Then
      expect(result).toMatchObject(subject1);
    });
  });
});