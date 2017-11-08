// make document shorter
let d = document;

// create an element and set attributes;
let createEleWithAttr = (ele, attr) => {
  attr = attr || {};
  let element = d.createElement(ele);
  for (let k in attr) {
    element.setAttribute(k, attr[k]);
  }
  return element;
};
// create Search for Information
let createUlForArtist = (artistInfo) => {
  // create ul element for artist
  let ulForArtist = createEleWithAttr('ul', {class: 'response'});
  // have the artist innerHTML to their name
  ulForArtist.innerHTML = `Search for Artist: ${artistInfo.name}`;
  // create li element for id and set the innerHTML
  let liArtistId = createEleWithAttr('li');
  liArtistId.innerHTML = `Artist id: ${artistInfo.id}`;
  // create li for genres and set the innerHTML
  let liGenres = createEleWithAttr('li');
  liGenres.innerHTML = `Genres Array: ${artistInfo.genres}`;
  // make and array and append li elements to artist
  [liArtistId, liGenres].forEach((li => ulForArtist.appendChild(li)));
  // make a gap
  ulForArtist.appendChild(createEleWithAttr('br'));
  // return the artist ul element
  return ulForArtist;
};
// Related artist info
let createUlForRelatedArtist = (relatedArtist) => {
  // create Ul for related artist
  let artist = createEleWithAttr('ul', {class: 'response'});
  artist.innerHTML = `Related artist: ${relatedArtist[0].name}`;
  // create li element for popularity
  let popularity = createEleWithAttr('li');
  popularity.innerHTML = `Popularity: ${relatedArtist[0].popularity}`;
  // create li element for genres
  let genres = createEleWithAttr('li');
  genres.innerHTML = `Genres: ${relatedArtist[0].genres}`;
  // create li element for matching tags
  let matching = createEleWithAttr('li');
  matching.innerHTML = `Matching genre tags: ${relatedArtist[1]}`;
  // append the li elements to ui artist
  [matching, popularity, genres].forEach(li => artist.appendChild(li));
  // return artist
  return artist;

};
// append name of songs to artist
let appendSongsToArtist = (songsList, artist) => {
  // create li variable
  let li;
  // start count at 1
  let count = 1;
  // use for of loop
  for (let song of songsList) {
    // each song, create an li element for the name of the song
    li = createEleWithAttr('li');
    li.innerHTML = `${count}: ${song}`;
    // apppend li to artist
    artist.appendChild(li);
    // increat count
    count++;
  }
};
// create Ul List for each artist
let renderArtistList = (artistList, songsList, appendTo) => {
  // create artistUl variable
  let artistUl;
  // for in loop over artistList, songsList should match accordingly
  for (let i = 0; i < artistList.length; i++) {
    // create Ul for artist
    artistUl = createUlForRelatedArtist(artistList[i]);
    // append the songs to the artist
    appendSongsToArtist(songsList[i], artistUl);
    // append to response
    appendTo.appendChild(artistUl);
    // add space
    appendTo.appendChild(createEleWithAttr('br'));
  }
};


// make call to server to get list of information
let getLists = () => {
  // get the value of the input form
  let value = d.getElementById('display');
  // get wrapper
  let wrapper = d.getElementById('wrapper');
  // get the response or create a new one if response === null
  let response = d.getElementById('response') !== null ?
                          d.getElementById('response') :
                          createEleWithAttr('div', {id: 'response'});
  response.innerHTML = 'Please wait while the magic happens in the background';

  wrapper.appendChild(response);
  // let we = createEleWithAttr('div');
  // console.log(we);
  let req = new Request(`http://localhost:3000/getList?q=${value.value}`, {
    method: 'POST'
  });

  fetch(req).then(res => {
    return res.json();
  }).then(data => {
    value.value = '';
    response.innerHTML = null;
    let searchFor = createUlForArtist(data[0]);
    response.appendChild(searchFor);

    renderArtistList(data[1], data[2], response);
  }).catch(err => console.warn('Request failed', err));
};
