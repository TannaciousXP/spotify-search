module.exports = {
  rp: require('request-promise'),
  idxToInsert: function(artist, genresArr) {
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
  sortBySimThenPop: function(artistArr, genresArr) {
    let output = Array.apply(null, Array(genresArr.length));
    output = output.map(ele => []);
    for (let artist of artistArr) {
      let i = this.idxToInsert(artist, genresArr.slice());
      if (i > 0) {
        this.insert(output[genresArr.length - i], artist);
      }
    }
    output = this.resortNestedArr(output, genresArr.length);
    return output;
  },
  getAlbums: function(simArr, token) {
    let output = [];
    for (let i = 0; i < simArr.length; i++) {
      let albumsOpt = {
        url: `https://api.spotify.com/v1/artists/${simArr[i].id}/albums?album_type=album&market=US`,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      output.push(this.rp.get(albumsOpt));
    }
    Promise.all(output).then(function(values) {
      console.log(`Promised to get albums ${values}`);
    }).catch(function(err) {
      console.log('Failed to get albums', err);
    });
  }
};
