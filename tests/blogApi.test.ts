import supertest from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import Blog, { IDehydratedBlog } from '../models/blog';
import { longListOfBlogs as initialBlogs } from '../utils/blog_helper';
import User from '../models/user';
import { listOfUsers as initialUsers } from '../utils/user_helper';

const api = supertest(app);
let loggedUser: any = {};

const postBlogToApi = (blog, expectedStatus = 201, withToken = true) => {
  const request = api
    .post('/api/blogs/')
    .send(blog)
    .expect(expectedStatus)
    .expect('Content-Type', /application\/json/);

  if (withToken) {
    request.set('Authorization', `Bearer ${loggedUser.token}`);
  }

  return request;
};

beforeEach(async () => {
  await User.deleteMany({});
  for (const user of initialUsers) {
    await api.post('/api/users').send(user);
    if (user.name === 'Moshi') {
      const response = await api.post('/api/login').send({ username: user.username, password: user.password });
      loggedUser = response.body;
    }
  }

  await Blog.deleteMany({});
  for (const blog of initialBlogs) {
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${loggedUser.token}`)
      .send(blog);
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
      const newBlog: IDehydratedBlog = {
        'title': 'Henri\'s tech blog',
        'author': 'Henri Väisänen',
        'url': 'henri.codes',
        'likes': 5,
      };

      await postBlogToApi(newBlog, 201, true);

      const response = await api
        .get('/api/blogs/');

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
        .set('Authorization', `Bearer ${loggedUser.token}`)
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
        .set('Authorization', `Bearer ${loggedUser.token}`)
        .send({ ...updatedBlog, user: updatedBlog.user.id })
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

    test('attempt adding blog without bearer token', async () => {
      await postBlogToApi(initialBlogs[0], 401, false);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
