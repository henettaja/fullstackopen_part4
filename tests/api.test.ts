import supertest from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { Blog } from '../models/blog';
import { longListOfBlogs as initialBlogs } from '../utils/blog_helper';

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  for (const blog of initialBlogs) {
    await new Blog(blog).save();
  }
});
describe('API endpoint /api/blogs', () => {
  test('returns correct amount of blogs', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('can succesfully add new blogs', async () => {
    const newBlog = 	{
      'title': 'Henri\'s tech blog',
      'author': 'Henri Väisänen',
      'url': 'henri.codes',
      'likes': 5
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs/');

    const blogTitles = response.body.map(r => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(blogTitles).toContain('Henri\'s tech blog');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
