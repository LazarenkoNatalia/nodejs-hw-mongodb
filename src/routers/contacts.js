import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  createContactsValidSchema,
  updateContactsValidSchema,
} from '../validation/contactsValidSchema.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id',  isValidId, ctrlWrapper(getContactByIdController));

router.post('/',  validateBody(createContactsValidSchema), ctrlWrapper(createContactController));

router.patch('/:id', validateBody(updateContactsValidSchema), ctrlWrapper(patchContactController));

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
