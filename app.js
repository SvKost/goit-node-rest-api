import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'node:path';
import 'dotenv/config';
import nodemailer from 'nodemailer';

import usersRouter from './routes/usersRouter.js';
import contactsRouter from './routes/contactsRouter.js';
import authMiddleware from './middlewares/auth.js';

import './db.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());

app.use('/avatars', express.static(path.resolve('public/avatars')));

app.use('/api/users', usersRouter);
app.use('/api/contacts', authMiddleware, contactsRouter);

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const message = {
  from: 'skost0634610557@gmail.com',
  to: 'skost0634610557@gmail.com',
  subject: 'Hello ✔',
  text: 'Hello world!',
  html: '<b>Hello world!</b>',
};

transporter.sendMail(message).then(console.log).catch(console.error);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log('Server is running. Use our API on port: 3000');
});
