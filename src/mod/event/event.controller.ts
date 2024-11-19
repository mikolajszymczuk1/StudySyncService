import type { Request, Response } from 'express';
import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import { getEventsBO, createEventBO, updateEventBO, removeEventBO } from '@/mod/event/eventBO';

/**
 * Get all events action
 * @param {Request} req request
 * @param {Response} res response
 */
export const getEventsAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const events = await getEventsBO(Number(userId));
    res.status(StatusCodesEnum.OK).json(events);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Create new event action
 * @param {Request} req request
 * @param {Response} res response
 */
export const createEventAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, eventDate } = req.body;

    const event = await createEventBO(Number(userId), name, Number(eventDate));
    res.status(StatusCodesEnum.NewResources).json(event);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Update event action
 * @param {Request} req request
 * @param {Response} res response
 */
export const updateEventAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { userId, name, eventDate } = req.body;

    const event = await updateEventBO(Number(eventId), Number(userId), name, Number(eventDate));
    res.status(StatusCodesEnum.NewResources).json(event);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};

/**
 * Remove event action
 * @param {Request} req request
 * @param {Response} res response
 */
export const removeEventAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    const event = await removeEventBO(Number(eventId), Number(userId));
    res.status(StatusCodesEnum.NewResources).json(event);
  } catch (err) {
    res.status(StatusCodesEnum.BadRequest).json({ error: err });
  }
};
