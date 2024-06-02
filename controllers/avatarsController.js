import fs from 'fs/promises';
import path from 'node:path';
import Jimp from 'jimp';
import User from '../models/users.js';

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
