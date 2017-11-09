## eaze coding challenge

By Peter X. Tan

### 1. System Requirements

* Globally installed [node](https://nodejs.org/en/)


### 2. Installation

On the command prompt run the following commands

```sh
$ git clone https://github.com/TannaciousXP/spotify-search.git && cd spotify-search

$ npm install
```

In separate terminal windows run the following command:

```sh
$ npm run start

```

In the browser, go to [eaze coding challenge](http://localhost:3000)

### 3. Tech Stack

**Node/Express/Body-Parser**

I chose Node/Express to take advantage Node's speed. Node is significantly easier to scale than Rails because of its blazing processing speed. It also allows for easier development, since both front and back end are written in the same language. 

**HTML5/CSS3/WEB API**

I chose to use raw HTML5/CSS3 because of the simple UI for the front end and utlize CSS3 to have the items align properly.

**Request/Request-Promise**

I chose Request because of the formatting to send over a request to the spotify API and to utilize the promise handling.

### 4. Funcs

* helperFuncs.js
  - idxToInsert(artist, genresArr)

  ```
  Takes in the artist and counts how many of the artist genre tags matches the search artist genresArr

  returns the idx (# of matched tags);
  ```

  - insert(simArr, artist, start, end);

  ```
  Takes the idxToInsert return value and find the array that matches the idxToInsert value and insert the artist into the array which is sorted by populary (b - a);

  returns an array of [[...#of matches tags artists], [...#of matches tags - 1 aritss], etc...]
  ```

  - resortNestedArr(nestedArr, length)
  
  ```
  takes the array from above and resort it into one 1 dimenson array filled with [artist, #match tags]
  
  [[artist, #mt], [artist, #mt], etc...] because this make it easier to use a promise all to retrieve the albums and the albums&track end points
  ```

  - sortBySimThenPop(artistArr, genresArr);

  ```
  This function uses all the funcs above and returns [[artist, #mt], [artist, #mt], etc...] to set up for getAlbums
  ```

  - getAlbums(sortedArr, token);

  ```
  Takes the array from sortBysimThenPop
  generate an array that are filled with API calls to get albums end point
  `https://api.spotify.com/v1/artists/${sortedArr.id}/albums?album_type=album&market=US`

  returns a resolve(values) from a promise all on the array filled with API calls
  ```

  - getAlbumsN Tracks

  ```
  After we get the albums, we make another API call to the end point 
  `https://api.spotify.com/v1/albums?ids=${albumsStr}&market=US`
  to get all the songs and albums info utilizing the same method from above

  returns a resolve(values) from a promise all on the array filled with API calls
  ```

  - filterAlbumsAndMakelist(albNtracks);

   ```
   After we get the albums and track, we will sort the album by popularity and filter list to get back 3 albums or less and pass the album and idx into genreatedList
   ```
  
  - genreateList(artistAlbums, idx);

  ```
  Creates an array for songsList
  Find out the ratio by adding all the popularity numbers and divide by 15
  take the popularity number and divide by ratio and that will give you X of songs to contribute to the list.

  At the end artistAlbums[idx] = list

  Once this is finish we will res.send([artist, srotedArr, albumsArr]) to the client
  ```

* scripts.js

  - createEleWithArr(ele, attr);

  ```
  returns an element and setAttritus
  ```

  - createUlForArtist(artistInfo)

  ```
  returns ul list ul.innerHTML = Search for Artist: ${name}
  li.innerHTML = `Artist id: ${id}`
  li.innerHTML = `Genres Array: ${genres}`;
  ```

  - creatUlForRelatedArtist(relatedArtist);

  ```
  returns ul list ul.innerHTML = `Related artist: ${.name}`;
  li.innerHTML = `Popularity: ${popularity}`;
  li.innerHTML = `Genres: ${genres}`;
  li.innerHTML = `Matching genre tags: ${#matching tags}`;
  ```

  - renderArtistList(artistList, songsList, apppendTo);

  ```
  Iterate over artistList or songsList and use the 3 functions above
  // create Ul for artist
  artistUl = createUlForRelatedArtist(artistList[i]);
  // append the songs to the artist
  appendSongsToArtist(songsList[i], artistUl);
  appendTo.appendChill(artistUl);
  ```
  - getList()

  ```
  When the search button is hit, it call the functions above and render everything on the page
  ```


### Next features
  * use the end point https://api.spotify.com/v1/tracks to get the tracks information
    - sort the tracks by popularity
  * write unit testing for the funcs
  * possibly instead of a setlist of songs, we can create a playlist with the end point
   - https://api.spotify.com/v1/users/{user_id}/playlists then add tracks to it
   - https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks


### Bugs
  - Currently, functions works. However, the code will break if we search up a really popular artist because of the stack calls.

  - Search daft punk, illenium will work
  - Search maroon 5 will cause maxium call stack exceed.
  - Possibly we can limit our search to a certain amount.
