module.exports = {
  rp: require('request-promise'),
  // setting a promise get URL
  // getRequest: function(urlOpt) {
  //   return new Promise(function(resolve, reject) {
  //     this.request(urlOpt, function(err, res, body) {
  //       if (!err && res.statusCode === 200) {
  //         resolve(body);
  //       } else {
  //         reject(err);
  //       }
  //     });
  //   });
  // }
};
