import http from 'http';
import express, { Express } from 'express';
const app: Express = express();
import mongoose from 'mongoose';
import config from './utils/config';

const mongoUrl = 'mongodb://localhost/bloglist';
mongoose.connect(mongoUrl);

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`🔥 Server running on port ${config.PORT}`);
});
