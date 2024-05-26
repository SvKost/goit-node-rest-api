import bcrypt from 'bcrypt';
import User from '../models/users.js';
import mongoose from 'mongoose';
import { createUserSchema, loginUserSchema } from '../schemas/usersSchema.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      email: email,
      password: passwordHash,
      subscription: subscription,
    };

    const { error } = createUserSchema.validate(user, {
      abortEarly: false,
    });

    if (typeof error !== 'undefined') {
      return res
        .status(400)
        .send(error.details.map(error => error.message).join(', '));
    }

    const isEmailExist = await User.findOne({ email });

    if (isEmailExist !== null) {
      return res.status(409).send({ message: 'Email in use' });
    }

    const newUser = await User.create(user);

    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = {
      email,
      password,
    };

    const user = await User.findOne({ email });

    const { error } = loginUserSchema.validate(existingUser, {
      abortEarly: false,
    });

    if (typeof error !== 'undefined') {
      return res
        .status(400)
        .send(error.details.map(error => error.message).join(', '));
    }

    if (user === null) {
      console.log('Email');
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log('Password');
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    res.status(200).send({ token: 'TOKEN', user });
  } catch (error) {
    next(error);
  }
};
