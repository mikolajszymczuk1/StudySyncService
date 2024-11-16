import express, { type Router } from 'express';
import { pingAction } from '@/mod/example/example.controller';

const exampleRouter: Router = express.Router();

exampleRouter.get('/ping', pingAction);

export default exampleRouter;
