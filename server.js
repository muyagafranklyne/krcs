const express = require('express');
const db = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Disaster Management API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
