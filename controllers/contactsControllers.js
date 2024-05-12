import HttpError from '../helpers/HttpError.js';
import crypto from 'node:crypto';
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
} from '../services/contactsServices.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

export const getAllContacts = (req, res) => {
  listContacts().then(contacts => res.status(200).json(contacts));
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) throw HttpError(404);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await removeContact(id);
    if (!removedContact) throw HttpError(404);
    res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const { error } = createContactSchema.validate(contact, {
      abortEarly: false,
    });

    if (typeof error !== 'undefined') {
      return res.status(400).json({ message: error.message });
    }

    const newContact = await addContact(contact);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingContact = await getContactById(id);
    if (!existingContact) throw HttpError(404);

    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    if (Object.keys(contact).length === 0) {
      return res
        .status(400)
        .json({ message: 'Body must have at least one field' });
    }

    const { error } = updateContactSchema.validate(contact, {
      abortEarly: false,
    });

    if (typeof error !== 'undefined') {
      return res.status(400).json({ message: error.message });
    }

    const updatedContact = await updateContactById(contact, id);
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
