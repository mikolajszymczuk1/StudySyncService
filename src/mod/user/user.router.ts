import express, { type Router } from 'express';
import { verifyToken } from '@/middleware/auth';
import { validRequest } from '@/middleware/validators/commonValidators';
import { updateDataAction } from '@/mod/user/user.controller';
import { updateDataValidators } from '@/mod/user/user.validation';

const userRouter: Router = express.Router();

userRouter.put('/updateData', [verifyToken, ...updateDataValidators, validRequest], updateDataAction);

export default userRouter;
