import express, { type Router } from 'express';
import { verifyToken } from '@/middleware/auth';
import { validRequest } from '@/middleware/validators/commonValidators';
import { getEventsAction, createEventAction, updateEventAction, removeEventAction } from '@/mod/event/event.controller';
import {
  getEventsValidators,
  createEventValidators,
  updateEventValidators,
  removeEventValidators,
} from '@/mod/event/event.validation';

const eventRouter: Router = express.Router();

eventRouter.get('/:userId', [verifyToken, ...getEventsValidators, validRequest], getEventsAction);

eventRouter.post('/', [verifyToken, ...createEventValidators, validRequest], createEventAction);

eventRouter.put('/:eventId', [verifyToken, ...updateEventValidators, validRequest], updateEventAction);

eventRouter.delete('/:eventId', [verifyToken, ...removeEventValidators, validRequest], removeEventAction);

export default eventRouter;
