import mongoose from 'mongoose';
import { listOfUsers as initialUsers } from '../utils/user_helper';
import supertest from 'supertest';
import app from '../app';
import User, { IUser } from '../models/user';

const api = supertest(app);

const postUserToApi = (user, expectedStatus = 201) => {
  return api
    .post('/api/users/')
    .send(user)
    .expect(expectedStatus)
    .expect('Content-Type', /application\/json/);
};
beforeEach(async () => {
  await User.deleteMany({});
  for (const user of initialUsers) {
    await api.post('/api/users').send(user);
  }
});

describe('User API', () => {
  describe('succesfully', function () {
    test('returns correct amount of users', async () => {
      const result = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(result.body).toHaveLength(initialUsers.length);
    });
    test('adds new users to db', async () => {
      const newUser: IUser = {
        username :'donald',
        name :'Donald Duck',
        password :'313',
        blogs: []
      };

      await postUserToApi(newUser);

      const result = await api.get('/api/users');

      const usernames = result.body.map(r => r.username);

      expect(result.body).toHaveLength(initialUsers.length + 1);
      expect(usernames).toContainEqual(newUser.username);
    });
  });
  describe('throws error if', function () {
    test('password too short', async () => {
      const userWithTooShortPassword: IUser = {
        username :'donald',
        name :'Donald Duck',
        password :'pw',
        blogs: []
      };

      await postUserToApi(userWithTooShortPassword, 400);
    });

    test('username too short', async () => {
      const userWithTooShortUsername = {
        username: 'dd',
        name :'Donald Duck',
        password :'313'
      };

      await postUserToApi(userWithTooShortUsername, 400);
    });

    test('username missing', async () => {
      const userWithoutUsername = {
        name :'Donald Duck',
        password :'313'
      };

      await postUserToApi(userWithoutUsername, 400);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
