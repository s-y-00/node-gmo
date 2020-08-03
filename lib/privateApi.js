var rp = require("request-promise");
var crypto = require("crypto");
var querystring = require("querystring");

var GmoPrivate = function(apiKey, apiSecret) {
  this.endPoint = "https://api.coin.z.com/private";
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
};

var privateApi = (module.exports = function(apiKey, apiSecret) {
  return new GmoPrivate(apiKey, apiSecret);
});

function toSha256(key, value) {
  return crypto
    .createHmac("sha256", key)
    .update(new Buffer(value))
    .digest("hex")
    .toString();
}

function makeHeader(queryData, apiKey, apiSecret) {
  var nonce = new Date().getTime();
  var message = nonce + queryData;
  return {
    "Content-Type": "application/json",
    "ACCESS-KEY": apiKey,
    "ACCESS-NONCE": nonce,
    "ACCESS-SIGNATURE": toSha256(apiSecret, message),
  };
}

GmoPrivate.prototype.query = function(options) {
  return rp(options)
    .then(function(json) {
      if (json.success == 1) {
        return json.data;
      } else {
        throw new Error(json.data.code);
      }
    })
    .catch(function(err) {
      console.log(err);
      throw new Error(err.statusCode);
    });
};

GmoPrivate.prototype.getQuery = function(path, query) {
  var data = "/v1" + path + querystring.stringify(query);
  var options = {
    uri: this.endPoint + path,
    qs: query,
    headers: makeHeader(data, this.apiKey, this.apiSecret),
    json: true,
  };
  return this.query(options);
};

GmoPrivate.prototype.postQuery = function(path, query) {
  var data = JSON.stringify(query);
  var options = {
    method: "POST",
    uri: this.endPoint + path,
    body: query,
    headers: makeHeader(data, this.apiKey, this.apiSecret),
    json: true,
  };
  return this.query(options);
};

GmoPrivate.prototype.getAsset = function() {
  return this.getQuery("account/assets", {});
};

GmoPrivate.prototype.getOrder = function(order_id) {
  return this.getQuery("/orders?", {
    order_id: order_id,
  });
};

GmoPrivate.prototype.getActiveOrders = function(pair, options) {
  var q = Object.assign({ pair: pair }, options);
  return this.getQuery("/activeOrders?", {
    symbol: pair,
    page: 1,
    count: 10,
  });
};

GmoPrivate.prototype.getExecutions = function(order_id) {
  return this.getQuery("/executions?", {
    order_id: order_id,
  });
};

GmoPrivate.prototype.getLatestExecutions = function(order_id) {
  var q = Object.assign({ pair: pair }, options);
  return this.getQuery("/latestExecutions?", {
    order_id: order_id,
    page: 1,
    count: 10,
  });
};

GmoPrivate.prototype.getOpenPositions = function(pair, options) {
  var q = Object.assign({ pair: pair }, options);
  return this.getQuery("/openPositions?", {
    symbol: pair,
  });
};

GmoPrivate.prototype.getPositionSummary = function(pair) {
  return this.getQuery("/positionSummary?", {
    symbol: pair,
    page: 1,
    count: 10,
  });
};

GmoPrivate.prototype.order = function(
  pair,
  price,
  losscutPrice,
  amount,
  side,
  type
) {
  return this.postQuery("/order", {
    symbol: pair,
    side: side,
    executionType: type,
    price: price,
    losscutPrice: losscutPrice,
    size: amount,
  });
};

GmoPrivate.prototype.changeOrder = function(orderId, price, losscutPrice) {
  return this.postQuery("/changeOrder", {
    orderId: orderId,
    price: price,
    losscutPrice: losscutPrice,
  });
};

GmoPrivate.prototype.cancelOrder = function(orderId) {
  return this.postQuery("/cancelOrder", {
    order_id: orderId,
  });
};

GmoPrivate.prototype.closeOrder = function(
  pair,
  price,
  positionId,
  amount,
  side,
  type
) {
  return this.postQuery("/closeOrder", {
    symbol: pair,
    side: side,
    executionType: type,
    price: price,
    settlePosition: [
      {
        positionId: positionId,
        size: amount,
      },
    ],
  });
};

GmoPrivate.prototype.closeBulkOrder = function(pair, price, side, type) {
  return this.postQuery("/closeBulkOrder", {
    symbol: pair,
    side: side,
    executionType: type,
    price: price,
  });
};

GmoPrivate.prototype.changeLosscutPrice = function(positionId, losscutPrice) {
  return this.postQuery("/changeLosscutPrice", {
    positionId: positionId,
    losscutPrice: losscutPrice,
  });
};
