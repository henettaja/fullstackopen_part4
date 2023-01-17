import config from './utils/config';
import blogsRouter from './controllers/blogs';
import middleware from './utils/middleware';
import logger from './utils/logger';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import mongoose from 'mongoose';


const app = express();
mongoose.set('strictQuery', false);

if (!config.MONGODB_URI) {
  throw new Error('🛑 Environment variable MONGODB_URI has not been set');
}

console.info('🔄 Connecting to', config.MONGODB_URI.split(':')[1]);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('✅ Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('🛑 Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
