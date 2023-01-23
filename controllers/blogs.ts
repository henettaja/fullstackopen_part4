import 'express-async-errors';
const blogsRouter = require('express').Router();
import logger from '../utils/logger';
import { Blog } from '../models/blog';

blogsRouter.get('/', async (request, response) => {
  logger.info('↩️ Fetching data from MongoDB');
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  logger.info('⤴️ Posting data to MongoDB\n', request.body);

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  });

  const result = await blog.save();
  response.status(201).json(result);
});

export default blogsRouter;
