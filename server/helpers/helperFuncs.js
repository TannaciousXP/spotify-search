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
  sortBySimThenPop: function(artistArr, genresArr) {
    let output = Array.apply(null, Array(genresArr.length));
    output = output.map(ele => []);
    for (let artist of artistArr) {
      let i = this.idxToInsert(artist, genresArr.slice());
      if (i > 0) {
        this.insert(output[genresArr.length - i], artist);
      }
    }
    return output;
  }
};
