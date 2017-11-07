const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const path = require('path');

// import from config folder and helpersFuncs.js
const {id, secret} = require('../config/config.js');
const func = require('./helpers/helperFuncs.js');

const app = express();
// use middleware
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));


// serve the index.html page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// options for getting access token
let authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(id + ':' + secret).toString('base64'))
  },
  form: {
    'grant_type': 'client_credentials'
  },
  json: true
};

// get the list;
app.use('/getList', (req, res) => {
  // get the search artist and replace spaces with +
  let artist = req.query.q.relace(/ /g, '+');
  // set up genres, artistId, token, sortedArr, albumsArr;
  let genres, artistId, token, sortedArr, albumsArr;
  // get access token
  rp.post(authOptions).then(body => {
    console.log(body);
    token = body.access_token;
    let artistOpt = {
      url: `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    // make another reqest to get artist info


  }).catch(err => console.log('Failed Request: ', err));




});


app.listen(3000, () => {
  console.log('Listening on spotify search');
});


