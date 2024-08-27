import { ContactsCollection } from '../db/modelContact.js';
 import { calculatePaginationData } from '../utils/calculatePaginationData.js';


export async function getAllContacts ({ page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
  userId,
  }) {

const limit = perPage;
  const skip =page > 0 ? (page - 1) * perPage : 0;

  // console.log("serv", limit, skip);

  const contactsQuery = ContactsCollection.find();

   if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

   if (typeof filter.isFavourite === 'boolean') {
     contactsQuery.where('isFavourite').equals(filter.isFavourite);
   }

   contactsQuery.where('userId').equals(userId);

 const [contactsCount, contacts] = await Promise.all([
   ContactsCollection.find({ userId }).merge(contactsQuery).countDocuments({ userId }),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

   const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData
  };



};

export const getContactById = async (id, userId  ) => {
 return await ContactsCollection.findOne({ _id:id, userId });
};

export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const updateContact = async ({id, userId}, payload, options = {}) => {
  const contactForUpdate = await ContactsCollection.findOneAndUpdate(
    { _id: id, userId },
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

export const deleteContact = async (id, userId) => {
  return await ContactsCollection.findOneAndDelete({ _id: id, userId });
};
