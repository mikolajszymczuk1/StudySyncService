import pgClient from '@/db/pgClient';
import bcrypt from 'bcrypt';
import { createUserBO } from '@/mod/auth/authBO';
import { getEventsBO, createEventBO, updateEventBO, removeEventBO } from '@/mod/event/eventBO';
import User from '@/mod/auth/model/User';
import { createTestEvent } from '@/utils/dbHelpers';
import Event from '@/mod/event/model/Event';

describe('Event BO', (): void => {
  let user: User;
  let event1: Event;
  let event2: Event;

  beforeAll(async (): Promise<void> => {
    await pgClient.user.deleteMany();
    const passwordHash = await bcrypt.hash('password', 10);
    user = await createUserBO('testUser', passwordHash);
  });

  beforeEach(async (): Promise<void> => {
    await pgClient.event.deleteMany();

    event1 = new Event(-1, 'Some event 1', 0, user.id);
    event2 = new Event(-1, 'Some event 2', 0, user.id);

    // Create some events for test
    event1.id = await createTestEvent(event1);
    event2.id = await createTestEvent(event2);
  });

  afterAll(async (): Promise<void> => {
    await pgClient.$disconnect();
  });

  describe('getEventsBO', (): void => {
    it('Should return all user events', async (): Promise<void> => {
      // Given
      const id: number = user.id;

      // When
      const result = await getEventsBO(id);

      // Then
      expect(result.length).toBe(2);
      expect(result).toMatchObject([event1, event2]);
    });
  });

  describe('createEventBO', (): void => {
    it('Should create new event', async (): Promise<void> => {
      // Given
      const id: number = user.id;
      const newEvent = new Event(-1, 'new event', 0, id);

      // When
      const result = await createEventBO(id, newEvent.name, newEvent.eventDate);

      // Then
      newEvent.id = result.id;
      expect(result).toMatchObject(newEvent);
    });
  });

  describe('updateEventBO', (): void => {
    it('Should update event', async (): Promise<void> => {
      // Given
      const id = user.id;
      const eventId = event1.id;
      event1.name = 'changed name';

      // When
      const result = await updateEventBO(eventId, id, event1.name, event1.eventDate);

      // Then
      expect(result).toMatchObject(event1);
      expect(result.name).toBe('changed name');
    });
  });

  describe('removeEventBO', (): void => {
    it('Should remove event', async (): Promise<void> => {
      // Given
      const id = user.id;
      const eventId = event1.id;
      const resultBefore = await getEventsBO(id);

      // When
      const result = await removeEventBO(eventId, id);

      // Then
      const resultAfter = await getEventsBO(id);
      expect(result).toMatchObject(event1);
      expect(resultBefore.length).toBe(2);
      expect(resultAfter.length).toBe(1);
    });
  });
});
