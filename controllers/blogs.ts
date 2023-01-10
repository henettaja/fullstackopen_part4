const blogsRouter = require('express').Router();
import logger from '../utils/logger';
import { Blog } from '../models/blog';

blogsRouter.get('/', (request, response, next) => {
  logger.info('↩️ Fetching data from MongoDB');
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

blogsRouter.post('/', (request, response, next) => {
  logger.info('⤴️ Posting data to MongoDB\n', request.body);

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  });

  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

export default blogsRouter;
