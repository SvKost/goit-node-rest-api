import HttpError from '../helpers/HttpError.js';
import crypto from 'node:crypto';
import Contact from '../models/contact.js';
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from '../schemas/contactsSchemas.js';
import { error } from 'node:console';
import mongoose from 'mongoose';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({});

    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid ID' });
  }

  try {
    const contact = await Contact.findById(id);

    if (contact === null) {
      throw HttpError(404, 'Not Found');
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid ID' });
  }

  try {
    const removedContact = await Contact.findByIdAndDelete(id);
    if (removedContact === null) {
      throw HttpError(404, 'Not Found');
    }
    res.status(200).send(removedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const { error } = createContactSchema.validate(contact, {
    abortEarly: false,
  });

  if (typeof error !== 'undefined') {
    throw HttpError(400, error.details.map(err => err.message).join(', '));
  }

  try {
    const newContact = await Contact.create(contact);

    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid ID' });
  }

  try {
    const existingContact = await Contact.findById(id);
    if (!existingContact) throw HttpError(404, 'Not Found');

    const contact = {
      name: req.body.name || existingContact.name,
      email: req.body.email || existingContact.email,
      phone: req.body.phone || existingContact.phone,
    };

    if (Object.keys(contact).length === 0) {
      throw HttpError(400, 'Body must have at least one field');
    }

    const { error } = updateContactSchema.validate(contact, {
      abortEarly: false,
    });

    if (typeof error !== 'undefined') {
      throw HttpError(400, error.details.map(err => err.message).join(', '));
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });

    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid ID' });
  }
  const { favorite } = req.body;

  try {
    const contact = await Contact.findById(id);
    if (!contact) throw HttpError(404, 'Not Found');

    const { error } = updateStatusContactSchema.validate(req.body, {
      abortEarly: false,
    });

    if (typeof error !== 'undefined') {
      throw HttpError(400, error.details.map(err => err.message).join(', '));
    }

    contact.favorite = favorite;
    await contact.save();

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};
