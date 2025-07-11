import express from 'express';
import path from 'path';

const app = express();
const port = 3000;
const __dirname = import.meta.dirname; 
const web_path = path.join(__dirname, '../../public');
const index_path = path.join(web_path, 'index.html');

app.use(express.static(web_path));

app.get('/*splat', (_, res) => { res.status(200).sendFile(index_path) });

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
