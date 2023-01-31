import User from '../models/user';
import logger from '../utils/logger';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { IBlog } from '../models/blog';

const usersRouter = require('express').Router();
const saltRounds = 10;

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate<{ blogs: IBlog[] }>('blogs', { title: 1, author: 1, url: 1, likes: 1 });
  response.json(users);
});
usersRouter.post('/',
  body('password').isLength({ min:3 }),
  async (request, response) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const user = new User({
      passwordHash: await bcrypt.hash(request.body.password, saltRounds),
      ...request.body
    });

    logger.info('⤴️ Creating a new user to db\n', request.body);
    const result = await user.save();
    response.status(201).send(result);
  });

export default usersRouter;
