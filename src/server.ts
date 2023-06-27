import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/second', (req, res) => {
  res.send('Second page');
});

app.post('/second', (req, res) => {
  res.send({ link: 'http://localhost:3000/' });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
