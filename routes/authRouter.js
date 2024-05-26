import express from 'express';
import { register, login } from '../controllers/authControllers.js';

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post('/register', jsonParser, register);
authRouter.post('/login', jsonParser, login);

export default authRouter;
