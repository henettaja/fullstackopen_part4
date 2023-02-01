import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from './logger';
import User from '../models/user';

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if ( !request.token ) {
    next();
    return;
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if ( !decodedToken.id ) {
    response.status(401).json({ error :'token invalid' });
    next();
    return;
  }

  const user = await User.findById(decodedToken.id);

  if ( !user ) {
    response.status(404).json({ error :'User not found' });
    next();
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  request.user = user!;
  next();
};

const unknownEndpoint = (request: Request, response: Response) => {
  logger.error('🛑 Request was made to an unkown endpoint');
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  logger.error('🛑 Error handler received error:\n', error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

export default {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
};
