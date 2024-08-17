import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();

 res.send({
    status: 200,
    message: 'Contacts found successfully.',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id);

  if (!contact) {
      throw createHttpError(404, 'Contact not found');
  }

  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${id}.`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const newContact = await createContact(req.body);

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { id } = req.params;
  const result = await updateContact(id, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { id } = req.params;
  const contactForDelete = await deleteContact(id);

  if (!contactForDelete) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
