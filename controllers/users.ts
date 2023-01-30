import User from '../models/user';
import logger from '../utils/logger';
import bcrypt from 'bcrypt';

const usersRouter = require('express').Router();
const saltRounds = 10;

usersRouter.post('/', async (request, response) => {
  const user = new User({
    passwordHash: await bcrypt.hash(request.body.password, saltRounds),
    ...request.body
  });

  logger.info('⤴️ Creating a new user to db\n', request.body);
  const result = await user.save();
  response.status(201).send(result);
});
usersRouter.get('/', async (request, response) => {
  const users = await User.find({});

  logger.info('↩️ Fetching blogs from db');
  response.json(users);
});

export default usersRouter;
