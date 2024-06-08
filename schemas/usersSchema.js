import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid('starter', 'pro', 'business')
    .default('starter'),
  avatarURL: Joi.string().optional().allow(null),
  token: Joi.string().optional().allow(null),
  verificationToken: Joi.string().optional().allow(null),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const resendEmailUserSchema = Joi.object({
  email: Joi.string().email().required(),
});
