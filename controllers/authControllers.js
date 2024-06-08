import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import crypto from 'node:crypto';
import mail from '../mail.js';
import User from '../models/users.js';
import { createUserSchema, loginUserSchema } from '../schemas/usersSchema.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    const userAvatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: '404',
    });

    const user = {
      email,
      password: passwordHash,
      subscription,
      avatarURL: userAvatar,
      verificationToken,
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

    mail.sendMail({
      to: email,
      from: 'skost0634610557@gmail.com',
      subject: 'Welcome to contact book!',
      html: `To verify your email please follow this <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To verify your email please follow this link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

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
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    if (user.verify === false) {
      return res.status(401).send({ message: 'Please verify your email' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    await User.findByIdAndUpdate(user.id, { token }, { new: true });

    res.status(200).send({ token, user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(401).send({ message: 'Not authorized' });
    }

    res.status(200).send({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};
