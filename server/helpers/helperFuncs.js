module.exports = {
  rp: require('request-promise'),
  // find out how many matching genre tags there are
  idxToInsert: function(artist, genresArr) {
    // track how many tags are matching, and we want to stay away from repeat matching
    // so I use splice
    let idx = 0;
    for (let genre of artist.genres) {
      let i = genresArr.indexOf(genre);
      if (i > -1) {
        genresArr.splice(i, 1);
        idx++;
      }
    }
    return idx;
  },
  // binary insert into the arr with the amount of matching tags
  insert: function(simArr, artist, start, end) {
    start = start || 0;
    end = end || simArr.length - 1;
    let mid = (start + end) >> 1;

    if (simArr.length === 0) {
      simArr.push(artist);
      return;
    }
    if (artist.popularity <= simArr[end].popularity) {
      simArr.splice(end + 1, 0, artist);
      return;
    }
    if (artist.popularity >= simArr[start].popularity) {
      simArr.splice(start, 0, artist);
      return;
    }
    if (start >= end) {
      return;
    }
    if (artist.popularity >= simArr[mid].popularity) {
      this.insert(simArr, artist, start, mid - 1);
      return;
    }
    if (artist.popularity <= simArr[mid].popularity) {
      this.insert(simArr, artist, mid + 1, end);
      return;
    }
  },
  // resort the arr to a single level;
  resortNestedArr: function(nestedArr, length) {
    return nestedArr.reduce((oneArr, artists, i) => {
      if (artists.length !== 0) {
        for (let artist of artists) {
          oneArr.push([artist, length - i]);
        }
      }
      return oneArr;
    }, []);
  },
  // return the list of artists sorted by popularity and how many tags match
  sortBySimThenPop: function(artistArr, genresArr) {
    // create an array of matching tags array
    let output = Array.apply(null, Array(genresArr.length));
    output = output.map(ele => []);
    // loop through the artist to see how many tags match
    for (let artist of artistArr) {
      // find out how many tags match if there is no matching tags we don't use the artist
      let i = this.idxToInsert(artist, genresArr.slice());
      // use insert to sort them into matching tags arr and sort by popularity
      if (i > 0) {
        this.insert(output[genresArr.length - i], artist);
      }
    }
    // after everything is completed, we sort the array into one level [artist, macthingTags]
    // for each artist
    output = this.resortNestedArr(output, genresArr.length);
    return output;
  },
  // get an array of artist albums;
  getAlbums: function(sortedArr, token) {
    // create an array to use promise all
    let output = [];
    let albumsOpt;
    // run a for loop to push api call into output
    for (let i = 0; i < sortedArr.length; i++) {
      albumsOpt = {
        url: `https://api.spotify.com/v1/artists/${sortedArr[i][0].id}/albums?album_type=album&market=US`,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      output.push(this.rp.get(albumsOpt));
    }
    // create a new promise to resolve all api calls
    return new Promise(function(resolve, reject) {
      Promise.all(output).then(function(values) {
        resolve(values);
      }).catch(function(err) {
        reject(err);
      });

    });
  },
  // generate a songList of 15 songs from albums;
  generateList: function(artistAlbums, idx) {
    // console.log('Inside genrateList');
    let songsList = [];
    let rand, songs, songsRatio, songsDebt, songsIdx, songsLength;
    // actions for one only album
    if (artistAlbums[idx].albums.length === 1) {
      // check to see if all the array had 15 songs
      let onlyAlbum = artistAlbums[idx].albums[0].tracks.items;
      if (onlyAlbum.length < 15) {
        for (let track of onlyAlbum) {
          songsList.push(track.name);
        }
      } else {
        for (let i = 0; i < 15; i++) {
          rand = onlyAlbum[Math.random() * onlyAlbum.length >> 0];
          songsList.push(rand.name);
        }
      }
    } else {
      // actions for if there is more than one artistAblums.albums
      let albumsNPopularity = [];
      for (let album of artistAlbums[idx].albums) {
        albumsNPopularity.push([album, album.popularity]);
      }
      // calculate the ratio;
      let ratio = (albumsNPopularity.reduce((count, album) => {
        count += album[1];
        return count;
      }, 0)) / 15;


      for (let albNPop of albumsNPopularity) {
        songs = albNPop[0].tracks.items;
        songsRatio = Math.round(albNPop[1] / ratio);
        if (songs.length < songsRatio) {
          // SongsDebt this just incase there aren't enough songs from the artist;
          songsDebt = songsRatio - songs.length;
          for (let i = 0; i < songs.length; i++) {
            songsIdx = Math.random() * songs.length >> 0;
            rand = songs[songsIdx];
            songsList.push(rand.name);
            songs.splice(songsIdx, 1);
          }
        } else {
          // if the next album can cover the songDebt, we will include it
          if (songsDebt !== 0 && (songs.length > (songsDebt + songsRatio))) {
            for (let i = 0; i < ((songsRatio + songsDebt)); i++) {
              songsIdx = Math.random() * songs.length >> 0;
              rand = songs[songsIdx];
              songsList.push(rand.name);
              songs.splice(songsIdx, 1);
            }
            // set songsDebt back to Zero;
            songsDebt = 0;
          } else {
            for (let i = 0; i < songsRatio; i++) {
              songsIdx = Math.random() * songs.length >> 0;
              rand = songs[songsIdx];
              songsList.push(rand.name);
              songs.splice(songsIdx, 1);
            }
          }
        }
      }
      // check if the songs is equal to 15
      if (songsList.length !== 15) {
        // condition for if songsList is > 15
        if (songsList.length > 15) {
          // find out how many is over
          let toPop = songsList.length - 15;
          // use a forloop to pop them out
          for (let i = 0; i < toPop; i++) {
            songsList.pop();
          }
          // check to see if the songs is < 15
        } else if (songsList.length < 15) {
          // check condition to see if there is only 1 album and no more songs
          if (artistAlbums[idx].albums.length === 1 && artistAlbums[idx].albums[0].tracks.items.length === 0) {
            // break out of if
            // do nothing if there is not enough songs;
          } else {
            // find out to add
            let toAdd = 15 - songsList.length;
            // use a while loop to fill in missing songs
            while (toAdd !== 0) {
              // get a random album
              rand = albumsNPopularity[Math.random() * albumsNPopularity.length >> 0];
              // get the random tracks
              songs = rand[0].tracks.items;
              if (songs.length !== 0) {
                songsIdx = Math.random() * songs.length >> 0;
                rand = songs[songsIdx];
                songsList.push(rand.name);
                songs.splice(idx, 1);
                toAdd--;
              }
            }
          }
        }
      }
    }
    artistAlbums[idx] = songsList;
  },
  // sort the album by popularity, then filter the songs, then calculate ratio and generateList
  filterAlbumsAndMakeList: function(albNTracks) {
    for (let i = 0; i < albNTracks.length; i++) {
      if (albNTracks[i].albums.length > 1) {
        albNTracks[i].albums = albNTracks[i].albums.sort((a, b) => b.popularity - a.popularity)
                                                   .filter((ele, i) => i < 3);
      }
      this.generateList(albNTracks, i);
    }
    return albNTracks;
  },
  // get albums tracks api using promise all
  getAlbumsNTracks: function(albumsList, token) {
    // set up array for output
    let output = [];
    let albumsNTracksOpt, albumsStr;
    // push all api calls into output
    for (let albums of albumsList) {
      albumsStr = '';
      for (let i = 0; i < albums.items.length; i++) {
        if (i === albums.items.length - 1) {
          albumsStr += `${albums.items[i].id}`;
        } else {
          albumsStr += `${albums.items[i].id},`;
        }
      }
      albumsNTracksOpt = {
        url: `https://api.spotify.com/v1/albums?ids=${albumsStr}&market=US`,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      output.push(this.rp.get(albumsNTracksOpt));
    }

    // return promise api calls
    return new Promise (function(resolve, reject) {
      Promise.all(output).then(albNTracks => {
        // call the the func getAlbums and Track
        resolve(albNTracks);
      }).catch(err => {
        reject(err);
      });
    });
  }
};
