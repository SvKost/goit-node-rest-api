import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  register,
  login,
  logout,
  current,
} from '../controllers/authControllers.js';

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post('/register', jsonParser, register);
authRouter.post('/login', jsonParser, login);
authRouter.post('/logout', authMiddleware, logout);
authRouter.get('/current', authMiddleware, current);

export default authRouter;
