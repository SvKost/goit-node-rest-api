import fs from 'fs/promises';
import path from 'node:path';
import User from '../models/users.js';

export const changeAvatar = async (req, res, next) => {
  try {
    const newPath = path.resolve('public', 'avatars', req.file.filename);
    await fs.rename(req.file.path, newPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: req.file.filename,
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
