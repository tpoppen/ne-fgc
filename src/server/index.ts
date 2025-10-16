import express from 'express';
import session from 'express-session';
// import * as client from 'openid-client';
import path from 'path';

// let server!: URL // Authorization Server's Issuer Identifier
// let clientId!: string // Client identifier at the Authorization Server
// let clientSecret!: string // Client Secret

// const config: client.Configuration = await client.discovery(
//   server,
//   clientId,
//   clientSecret,
// );

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

/// TODO: fix build step, for some reason i'm getting a docker error and cannot run this code?
// Try doing this with an env variable instead of import path
let publicPath = path.join(__dirname, '../../public');
if (__dirname.includes('dist')) {
  publicPath = path.join(__dirname, '../../../public');
}
const index_path = path.join(publicPath, 'index.html');

app.use(express.static(publicPath));
// app.use(
//   session({
//     secret: '',
//     resave: false,
//     saveUninitialized: false,
//   })
// );
  
app.get('/*splat', (_, res) => { res.status(200).sendFile(index_path) });

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
