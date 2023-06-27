'use strict';

const express = require('express');
const app = express();

app.use('/', (req, res) => {
  res.status(200).send('test 4');
});

app.listen(3000);

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
