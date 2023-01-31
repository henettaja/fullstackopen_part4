import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

export const listOfUsers: IUser[] = [
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'password',
    blogs: []
  },
  {
    username: 'hellas',
    name: 'Arto Hellas',
    password: 'salasana',
    blogs: []
  }
];

export const decodeTokenAndFindUser = async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if ( !user ) {
    return response.status(404).json({ error: 'User not found' });
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return user!;
};
