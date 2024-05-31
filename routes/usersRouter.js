import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import uploadMiddleware from '../middlewares/upload.js';
import {
  register,
  login,
  logout,
  current,
} from '../controllers/authControllers.js';
import { changeAvatar } from '../controllers/avatarsController.js';

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post('/register', jsonParser, register);
usersRouter.post('/login', jsonParser, login);
usersRouter.post('/logout', authMiddleware, logout);
usersRouter.get('/current', authMiddleware, current);
usersRouter.patch(
  '/avatars',
  uploadMiddleware.single('avatar'),
  authMiddleware,
  changeAvatar
);

export default usersRouter;
