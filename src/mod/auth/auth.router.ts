import express, { type Router } from 'express';
import { loginAction, logoutAction, registerAction, getSessionAction } from '@/mod/auth/auth.controller';
import { verifyToken } from '@/middleware/auth';
import { loginValidators, registerValidators } from '@/mod/auth/auth.validation';
import { validRequest } from '@/middleware/validators/commonValidators';

const authRouter: Router = express.Router();

authRouter.post('/login', [...loginValidators, validRequest], loginAction);

authRouter.post('/logout', logoutAction);

authRouter.post('/register', [...registerValidators, validRequest], registerAction);

authRouter.get('/session', verifyToken, getSessionAction);

export default authRouter;
