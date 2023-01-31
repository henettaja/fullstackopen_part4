import logger from './logger';
import { NextFunction, Request, Response } from 'express';

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
  unknownEndpoint,
  errorHandler
};
