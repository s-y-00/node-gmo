var rp = require("request-promise");

var GmoPublic = function() {
  this.endPoint = "https://api.coin.z.com/public/v1";
};

function errorParser(json) {
  if (json.status == 0) {
    return json.data;
  } else {
    throw new Error(json.data.code);
  }
}

GmoPublic.prototype.query = function(option) {
  return rp(option)
    .then(function(res) {
      var json = JSON.parse(res);
      return errorParser(json);
    })
    .catch(function(err) {
      console.log("Error: " + err);
      throw new Error(err.statusCode);
    });
};

GmoPublic.prototype.getStatus = function() {
  var path = "/status";
  return this.query(this.endPoint + path);
};

GmoPublic.prototype.getTicker = function(pair) {
  var path = "/ticker?symbol=" + pair;
  return this.query(this.endPoint + path);
};

GmoPublic.prototype.getOrderbooks = function(pair) {
  var path = "/orderbooks?symbol=" + pair;
  return this.query(this.endPoint + path);
};

GmoPublic.prototype.getTrades = function(pair) {
  var path = "/trades?symbol=" + pair + "&page=1&count=10";
  return this.query(this.endPoint + path);
};

var publicApi = (module.exports = function() {
  return new GmoPublic();
});
