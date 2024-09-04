import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  // console.log(page, perPage);
  const { sortBy, sortOrder } = parseSortParams(req.query);
   const  filter  = parseFilterParams(req.query);

  const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter,  userId: req.user._id, })
;

 res.send({
    status: 200,
    message: 'Contacts found successfully.',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
   const contact = await getContactById(id , req.user._id );

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${id}.`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const photo = req.file;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  };

  const newContact = await createContact({ ...req.body, userId: req.user._id , photo: photoUrl,});

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { id } = req.params;
  const photo = req.file;

  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }
  const result = await updateContact({id , userId: req.user._id, },  { ...req.body, photo: photoUrl });

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
  const contactForDelete = await deleteContact( id,  req.user._id, );

  if (!contactForDelete) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
