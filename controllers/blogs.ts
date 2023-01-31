import 'express-async-errors';
import logger from '../utils/logger';
import { Blog } from '../models/blog';

const blogsRouter = require('express').Router();

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate<{ user: IUser }>('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0
  });

  logger.info('⤴️ Posting a blog to db\n', request.body);
  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  const idToRemove = request.params.id;

  logger.info(`⌫ Deleting a blog with id ${idToRemove} from db`);
  await Blog.deleteOne({ _id: idToRemove });

  response.status(204).send();
});

blogsRouter.put('/:id', async (request, response) => {
  const idToUpdate = request.params.id;

  const updatedBlog = request.body;

  logger.info(`⌫ Updating a blog with id ${idToUpdate} from db`);
  const result = await Blog.findByIdAndUpdate(idToUpdate, updatedBlog, { new: true });

  response.status(200).json(result);
});

export default blogsRouter;
