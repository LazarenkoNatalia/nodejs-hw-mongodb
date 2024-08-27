import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userRegistrValidSchema } from '../validation/userRegistrValidSchema.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { userValidSchema } from '../validation/userValidSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userRegistrValidSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(userValidSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/refresh', ctrlWrapper(refreshSessionController));

authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;
