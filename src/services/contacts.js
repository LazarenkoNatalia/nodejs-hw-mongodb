import { ContactsCollection } from '../db/modelContact.js';
 import { calculatePaginationData } from '../utils/calculatePaginationData.js';


export async function getAllContacts ({ page,
  perPage,
  sortBy,
  sortOrder,
  }) {

const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

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
