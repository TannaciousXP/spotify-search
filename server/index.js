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
  let artist = req.query.q.replace(/ /g, '+');
  // set up genres, artistId, token, sortedArr, albumsArr;
  let genres, artistId, token, sortedArr, albumsArr;
  // get access token
  rp.post(authOptions).then(body => {
    token = body.access_token;
    let artistOpt = {
      url: `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    // make another reqest to get artist info
    rp.get(artistOpt).then(body => {
      genres = body.artists.items[0].genres;
      artistId = body.artists.items[0].id;
      artist = body.artists.items[0];
      let simOpts = {
        url: `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      // search up related artists
      rp.get(simOpts).then(body => {
        // X = matching genreTags
        // sort the body by [artist, X]
        sortedArr = func.sortBySimThenPop(body.artists, genres);
        // send a request to get albums
        func.getAlbums(sortedArr, token).then(relatedArtist => {
          // send a request to get albums and track
          func.getAlbumsNTracks(relatedArtist, token).then(albNtracks => {
            // filter Tracks
            albumsArr = func.filterAlbumsAndMakeList(albNtracks);
            res.send([artist, sortedArr, albumsArr]);

          }).catch(err => console.log('Failed to get albums and tracks', err));
        }).catch(err => console.log('Failed to get songsList: ', err));


      }).catch(err => console.log('Failed to get similar artists', err));
    }).catch(err => console.log('Failed to get artist', err));
  }).catch(err => console.log('Failed to get token: ', err));
});


app.listen(3000, () => {
  console.log('Listening on spotify search');
});


