import express, { type Express } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { json } from 'body-parser';
import type { AppConfig } from '@/types/AppConfig';
import exampleRouter from '@/mod/example/example.router';
import authRouter from '@/mod/auth/auth.router';
import userRouter from '@/mod/user/user.router';
import subjectRouter from '@/mod/subject/subject.router';
import todoRouter from '@/mod/todo/todo.router';
import eventRouter from '@/mod/event/event.router';

/**
 * Create app object
 * @param {AppConfig} config all config properties for application based on env mode
 * @returns {Express} express app instance
 */
export const createApp = (config: AppConfig): Express => {
  const app: Express = express();

  // Modules
  app.use(json());
  app.use(helmet());
  app.use(compression());
  app.use(cors({ origin: config.api.baseClientUrl, credentials: true }));

  // Routes
  app.use('/api/example', exampleRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/subject', subjectRouter);
  app.use('/api/todo', todoRouter);
  app.use('/api/event', eventRouter);

  return app;
};
