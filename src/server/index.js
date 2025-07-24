import express from 'express';
import path from 'path';

import authpkg  from 'express-openid-connect';
const { auth, requiresAuth } = authpkg;

import initializeDatabase from './initializeDatabase.js';
import { KEYS, provide } from './mediator.js';

const db = initializeDatabase();
db.authenticate();
provide(KEYS.SEQUELIZE, db);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env['AUTH_SECRET'],
  baseURL: 'http://localhost:3000',
  clientID: process.env['AUTH_CLIENT_ID'],
  issuerBaseURL: process.env['AUTH_ISSUER_BASE_URL'],
};

const app = express();
const port = 3000;
const __dirname = import.meta.dirname; 
const web_path = path.join(__dirname, '../../public');
const index_path = path.join(web_path, 'index.html');

app.use(express.static(web_path));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get('/profile', requiresAuth(), (req, res) => {
  console.log(req.oidc.user);
  res.send(JSON.stringify(req.oidc.user));
});

app.get('/*splat', (_, res) => { res.status(200).sendFile(index_path) });

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
