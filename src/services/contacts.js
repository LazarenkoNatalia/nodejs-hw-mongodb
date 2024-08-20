import { ContactsCollection } from '../db/modelContact.js';
 import { calculatePaginationData } from '../utils/calculatePaginationData.js';


export async function getAllContacts ({ page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  filter = {},
  }) {

const limit = perPage;
  const skip =(page - 1) * perPage;

  console.log("serv", limit, skip);

  const contactsQuery = ContactsCollection.find();

  // if (filter.type) {
  //   contactsQuery.where('contactType').equals(filter.type);
  // }

  // if (typeof filter.isFavourite === 'boolean') {
  //   contactsQuery.where('isFavourite').equals(filter.isFavourite);
  // }


 const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      // .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

   const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData
  };



};

export const getContactById = async (id) => {
  const contact = await ContactsCollection.findById(id);
  return contact;
};

export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const updateContact = async (id, payload, options = {}) => {
  const contactForUpdate = await ContactsCollection.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!contactForUpdate || !contactForUpdate.value) return null;
  return {
    contact: contactForUpdate.value,
  };
};

export const deleteContact = async (id) => {
  return await ContactsCollection.findOneAndDelete({ _id: id });
};
