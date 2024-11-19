import pgClient from '@/db/pgClient';
import Event from '@/mod/event/model/Event';

/**
 * Get all events
 * @param {number} userId user id
 * @returns {Promise<Event[]>} all user events
 */
export const getEventsDAO = async (userId: number): Promise<Event[]> => {
  const events = await pgClient.event.findMany({ where: { userId } });
  return events.map((event) => Event.eventFromPrisma(event));
};

/**
 * Create new event
 * @param {number} userId user id
 * @param {string} name event name
 * @param {number} eventDate event start date
 * @returns {Promise<Event>} created event object
 */
export const createEventDAO = async (userId: number, name: string, eventDate: number): Promise<Event> => {
  const event = await pgClient.event.create({
    data: {
      name,
      eventDate: new Date(eventDate),
      userId,
    },
  });

  return Event.eventFromPrisma(event);
};

/**
 * Update event
 * @param {number} eventId event id
 * @param {number} userId user id
 * @param {string} name event name
 * @param {number} eventDate event start date
 * @returns {Promise<Event>} updated event object
 */
export const updateEventDAO = async (
  eventId: number,
  userId: number,
  name: string,
  eventDate: number,
): Promise<Event> => {
  const updatedEvent = await pgClient.event.update({
    where: { id: eventId, userId },
    data: {
      name,
      eventDate: new Date(eventDate),
    },
  });

  return Event.eventFromPrisma(updatedEvent);
};

/**
 * Remove event
 * @param {number} eventId event id
 * @param {number} userId user id
 * @returns {Promise<Event>} removed event object
 */
export const removeEventDAO = async (eventId: number, userId: number): Promise<Event> => {
  const removedEvent = await pgClient.event.delete({ where: { id: eventId, userId } });
  return Event.eventFromPrisma(removedEvent);
};
