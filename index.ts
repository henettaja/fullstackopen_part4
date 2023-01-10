import http from 'http';
import express, { Express } from 'express';
const app: Express = express();
import config from './utils/config';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`🔥 Server running on port ${config.PORT}`);
});
