import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

import ApiRouter from './routers/api.js';
import cognitoIdentityProviderClient from './utils/cognitoIdentityProviderClient.js';
import dynamoDbClientProvider from './db/dynamoDbClientProvider.js';
import cognitoJWTVerifier from './utils/cognitoJWTVerifier.js';

dotenv.config();

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

let publicPath = path.join(__dirname, '../../public');
if (__dirname.includes('dist')) {
  publicPath = path.join(__dirname, '../../../public');
}
const index_path = path.join(publicPath, 'index.html');

// Initialize utils, database, etc etc
cognitoIdentityProviderClient.init();
cognitoJWTVerifier.init();
dynamoDbClientProvider.init();

// register middleware
// app.use('/', (req, res, next) => {
//   next();
// });

app.use(express.json());

// register api routes
app.use('/api', ApiRouter);

// serve static react page
app.use(express.static(publicPath));
app.get('/*splat', (_, res) => {
  console.log(`${Date.now()}: Resolving to static page fetch`);
  res.status(200).sendFile(index_path);
});

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
