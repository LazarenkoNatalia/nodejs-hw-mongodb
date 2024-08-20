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

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:id',  isValidId, ctrlWrapper(getContactByIdController));

router.post('/contacts',  validateBody(createContactsValidSchema), ctrlWrapper(createContactController));

router.patch('/contacts/:id', validateBody(updateContactsValidSchema), ctrlWrapper(patchContactController));

router.delete('/contacts/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
