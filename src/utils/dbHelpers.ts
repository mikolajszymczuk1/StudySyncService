import Subject from '@/mod/subject/model/Subject';
import Todo from '@/mod/todo/model/Todo';
import Event from '@/mod/event/model/Event';
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

/**
 * Create test todo object (for tests only)
 * @param {Todo} todo todo object to take data from
 * @returns {number} created todo id
 */
export const createTestTodo = async (todo: Todo): Promise<number> => {
  const { id } = await pgClient.todo.create({
    data: {
      name: todo.name,
      order: todo.order,
      isComplete: todo.isComplete,
      userId: todo.userId,
    },
  });

  return id;
};

/**
 * Crate test event object (for tests only)
 * @param {Event} event event object to take data from
 * @returns {number} created event id
 */
export const createTestEvent = async (event: Event): Promise<number> => {
  const { id } = await pgClient.event.create({
    data: {
      name: event.name,
      eventDate: new Date(event.eventDate),
      userId: event.userId,
    },
  });

  return id;
};
