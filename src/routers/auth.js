import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userRegistrValidSchema } from '../validation/userRegistrValidSchema.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { userValidSchema } from '../validation/userValidSchema.js';
import { requestResetEmailSchema } from '../validation/requestResetEmail.js';
import { resetPasswordSchema } from '../validation/resetPasswordSchema.js';


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

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
