import fs from 'fs/promises';
import path from 'node:path';
import Jimp from 'jimp';
import User from '../models/users.js';
import mail from '../mail.js';
import { resendEmailUserSchema } from '../schemas/usersSchema.js';

export const changeAvatar = async (req, res, next) => {
  try {
    const filename = req.file.filename;
    const filePath = req.file.path;
    const newPath = path.resolve('public', 'avatars', filename);

    const image = await Jimp.read(filePath);
    image.resize(250, 250);

    await image.writeAsync(newPath);
    await fs.unlink(filePath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: `/avatars/${filename}`,
      },
      { new: true }
    );

    if (user === null) {
      return res.status(401).send({ message: 'Not authorized' });
    }

    res.status(200).send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (user === null || user.verify === true) {
      return res.status(404).send({ message: 'Not Found' });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send({ message: 'Verification successful' });
  } catch (error) {
    next(error);
  }
};

export const resendEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { error } = resendEmailUserSchema.validate(
      { email },
      {
        abortEarly: false,
      }
    );

    if (typeof error !== 'undefined') {
      return res.status(400).send({ message: 'missing required field email' });
    }

    const user = await User.findOne({ email });

    if (user === null || user.verify === true) {
      return res
        .status(400)
        .send({ message: 'Verification has already been passed' });
    }

    mail.sendMail({
      to: email,
      from: 'skost0634610557@gmail.com',
      subject: 'Welcome to contact book!',
      html: `To verify your email please follow this <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
      text: `To verify your email please follow this link http://localhost:3000/api/users/verify/${user.verificationToken}`,
    });

    res.status(200).send({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};
