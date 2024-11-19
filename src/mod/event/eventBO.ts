import Event from '@/mod/event/model/Event';
import { getEventsDAO, createEventDAO, updateEventDAO, removeEventDAO } from '@/mod/event/eventDAO';

/**
 * Get all events
 * @param {number} userId user id
 * @returns {Promise<Event[]>} all user events
 */
export const getEventsBO = async (userId: number): Promise<Event[]> => {
  return await getEventsDAO(userId);
};

/**
 * Create new event
 * @param {number} userId user id
 * @param {string} name event name
 * @param {number} eventDate event start date
 * @returns {Promise<Event>} created event object
 */
export const createEventBO = async (userId: number, name: string, eventDate: number): Promise<Event> => {
  return await createEventDAO(userId, name, eventDate);
};

/**
 * Update event
 * @param {number} eventId event id
 * @param {number} userId user id
 * @param {string} name event name
 * @param {number} eventDate event start date
 * @returns {Promise<Event>} updated event object
 */
export const updateEventBO = async (
  eventId: number,
  userId: number,
  name: string,
  eventDate: number,
): Promise<Event> => {
  return await updateEventDAO(eventId, userId, name, eventDate);
};

/**
 * Remove event
 * @param {number} eventId event id
 * @param {number} userId user id
 * @returns {Promise<Event>} removed event object
 */
export const removeEventBO = async (eventId: number, userId: number): Promise<Event> => {
  return await removeEventDAO(eventId, userId);
};
