import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

import ApiRouter from './routers/api.js';
import cognitoIdentityProviderClient from './utils/cognitoIdentityProviderClient.js';
import dynamoDbClientProvider from './db/dynamoDbClientProvider.js';
import cognitoJWTVerifier from './utils/cognitoJWTVerifier.js';
import loadEnvVariables from './utils/loadEnvVariables.js';

dotenv.config();

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

const publicPath = path.join(__dirname, '../public');
const index_path = path.join(publicPath, 'index.html');

const secretsName = `ne-fgc-app-config-${process.env.NODE_ENV}`;
console.log(`Starting app for NODE_ENV: ${process.env.NODE_ENV}`);

// fetch secrets for app
await loadEnvVariables(secretsName)

// Initialize utils, database, etc etc
cognitoIdentityProviderClient.init();
cognitoJWTVerifier.init();
dynamoDbClientProvider.init();

// register middleware
app.use(express.json());

// logging middleware for each request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// register api routes
app.use('/api', ApiRouter);

app.get('/healthcheck', (_, res) => {
  console.log("health check received");
  res.sendStatus(200);
});

// serve static react page
app.use(express.static(publicPath));
app.get('/*splat', (req, res, next) => {
  const ext = path.extname(req.url);
  if (ext && ext !== '.html') { return next(); }
  res.status(200).sendFile(index_path);
});

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
