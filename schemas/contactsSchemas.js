import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().required().email(),
  phone: Joi.string().min(7).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().min(7),
});

export const updateStatusContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().min(7),
  favorite: Joi.boolean().required(),
});
