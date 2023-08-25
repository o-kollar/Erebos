const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 3000;
const axios = require('axios');
const { exec } = require('child_process');
const routes = require('./src/router');
const path = require('path');

var PouchDB = require('pouchdb');
var db = new PouchDB('TestDB');



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
app.use(express.static('public'));
app.use('/', routes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Execute the command
const child = exec('tmole 3000');

// Listen for the output of the command
child.stdout.on('data', (data) => {
  const output = data;
  const searchText = "is forwarding to localhost:3000";
  
  const remainingText = output.replace(searchText, "");
  console.log(remainingText);
  url = remainingText.replace(/\n/g, "").trim(); // Remove newline characters and trim whitespaces
});

// Listen for any errors
child.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

// Listen for the command to exit
child.on('exit', (code, signal) => {
  console.log(`Command exited with code ${code} and signal ${signal}`);
});








