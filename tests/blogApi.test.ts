import supertest from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import Blog from '../models/blog';
import { longListOfBlogs as initialBlogs } from '../utils/blog_helper';

const api = supertest(app);

const postBlogToApi = (blog, expectedStatus = 201) => {
  return api
    .post('/api/blogs/')
    .send(blog)
    .expect(expectedStatus)
    .expect('Content-Type', /application\/json/);
};

beforeEach(async () => {
  await Blog.deleteMany({});
  for (const blog of initialBlogs) {
    await new Blog(blog).save();
  }
});

describe('Blog API', () => {
  describe('succesfully', function () {
    test('returns correct amount of blogs', async () => {
      const response = await api
        .get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.length).toBe(initialBlogs.length);
    });

    test('adds new blogs to db', async () => {
      const newBlog = {
        'title': 'Henri\'s tech blog',
        'author': 'Henri Väisänen',
        'url': 'henri.codes',
        'likes': 5
      };

      await postBlogToApi(newBlog);

      const response = await api.get('/api/blogs/');

      const blogTitles = response.body.map(r => r.title);

      expect(response.body).toHaveLength(initialBlogs.length + 1);
      expect(blogTitles).toContain('Henri\'s tech blog');
    });

    test('Converts field "_id" to "id"', async () => {
      const response = await api.get('/api/blogs/');

      expect(response.body[0].id).toBeDefined();
    });

    test('Missing value "likes" defaults to 0', async () => {
      const blogWithoutLikes = {
        'title': 'Henri\'s tech blog',
        'author': 'Henri Väisänen',
        'url': 'henri.codes',
      };

      await postBlogToApi(blogWithoutLikes);

      const response = await api.get('/api/blogs/');

      const savedBlog = response.body.find(blog => blog.title === blogWithoutLikes.title);

      expect(savedBlog.likes).toBeDefined();
      expect(savedBlog.likes).toBe(0);
    });

    test('deletes blogs', async () => {
      const blog = (await api
        .get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/)).body[0];

      await api
        .delete(`/api/blogs/${blog.id}`)
        .expect(204);

      const response = await api
        .get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.length).toBe(initialBlogs.length - 1);
      expect(response.body).not.toContainEqual(blog);
    });

    test('updates blogs', async () => {
      const blog = (await api
        .get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/)).body[0];

      const updatedBlog = { ...blog, likes: blog.likes + 3 };

      const returnedBlog = (await api
        .put(`/api/blogs/${blog.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)).body;

      const responseBody = (await api
        .get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/)).body;

      expect(returnedBlog.likes).toBe(blog.likes + 3);
      expect(responseBody).toContainEqual(updatedBlog);
    });
  });

  describe('throws error if', function () {
    test('values for "title" or "url" are missing', async () => {
      const invalidBlog = {
        'author': 'Henri Väisänen',
        'likes': 5
      };

      await postBlogToApi(invalidBlog, 400);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
