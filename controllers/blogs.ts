import 'express-async-errors';
import Blog from '../models/blog';
import { IUser } from '../models/user';

const blogsRouter = require('express').Router();

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate<{ user: IUser }>('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const user = request.user;

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user.id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user;
  const idToRemove = request.params.id;

  const blogToDelete = await Blog.findOne({ _id: idToRemove });

  if ( !blogToDelete || blogToDelete.user.toString() !== user.id.toString() ) {
    return response.status(401).send({ 'error': 'User does not have rights to delete requested blog' });
  }
  await blogToDelete.deleteOne();
  response.status(204).send();
});

blogsRouter.put('/:id', async (request, response) => {
  const idToUpdate = request.params.id;

  const updatedBlog = request.body;

  const result = await Blog.findByIdAndUpdate(idToUpdate, updatedBlog, { new: true });

  response.status(200).json(result);
});

export default blogsRouter;
