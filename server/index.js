const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

const app = express();

// use middleware
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// server the index.html page
app.use('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// get the list;
app.use('/getList', (req, res) => {

});


app.listen(3000, () => {
  console.log('Listening on spotify search');
});


