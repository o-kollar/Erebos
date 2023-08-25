const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 3000;
const routes = require('./src/router');
const path = require('path');

let url;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Headers','*');
  next();
});
// Serve static files from the "public" directory
app.use(express.json());
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



