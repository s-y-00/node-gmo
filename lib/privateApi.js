var rp = require("request-promise");
var crypto = require("crypto");
var querystring = require("querystring");

var GmoPrivate = function (apiKey, apiSecret)
{
  this.endPoint = "https://api.coin.z.com/private/v1";
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
};

var privateApi = (module.exports = function (apiKey, apiSecret)
{
  return new GmoPrivate(apiKey, apiSecret);
});

function toSha256(key, value)
{
  return crypto
    .createHmac("sha256", key)
    .update(new Buffer.from(value))
    .digest("hex")
    .toString();
}

function makeHeader(nonce, queryData, apiKey, apiSecret)
{
  return {
    "Content-Type": "application/json",
    "API-KEY": apiKey,
    "API-TIMESTAMP": nonce,
    "API-SIGN": toSha256(apiSecret, queryData),
  };
}

GmoPrivate.prototype.query = function (options)
{
  return rp(options)
    .then(function (json)
    {
      if(json.status == undefined) json = JSON.parse(json);
      if (json.status == 0)
      {
        return json.hasOwnProperty("data") ? json.data : {};
      } else
      {
              console.log(json.messages[0]);
        throw new Error(json.messages[0]);
      }
    })
    .catch(function (err)
    {
      console.log(err);
      throw new Error(err.message_code);
    });
};

GmoPrivate.prototype.getQuery = function (path, query)
{
  var nonce = new Date().getTime().toString();
  var method = "GET";
  var ver = "/v1";
  var data = nonce + method + ver + path;
  var options = {
    uri: this.endPoint + path,
    qs: query,
    headers: makeHeader(nonce, data, this.apiKey, this.apiSecret),
    json: true,
  };
  return this.query(options);
};

GmoPrivate.prototype.postQuery = function (path, query)
{
  var nonce = new Date().getTime().toString();
  var method = "POST";
  var ver = "/v1";
  var body = JSON.stringify(query);
  var data = nonce + method + ver + path + body;
  var options = {
    uri: this.endPoint + path,
    method: method,
    body: body,
    headers: makeHeader(nonce, data, this.apiKey, this.apiSecret),
  };
  return this.query(options);
};

GmoPrivate.prototype.getMargin = function ()
{
  return this.getQuery("/account/margin", {});
};

GmoPrivate.prototype.getAsset = function ()
{
  return this.getQuery("/account/assets", {});
};

GmoPrivate.prototype.getOrder = function (orderId)
{
  return this.getQuery("/orders", {
    orderId: orderId,
  });
};

GmoPrivate.prototype.getActiveOrders = function (pair, options)
{
  var q = Object.assign({ pair: pair }, options);
  return this.getQuery("/activeOrders", {
    symbol: pair,
    page: 1,
    count: 10,
  });
};

GmoPrivate.prototype.getExecutions = function (orderId)
{
  return this.getQuery("/executions", {
    orderId: orderId,
  });
};

GmoPrivate.prototype.getLatestExecutions = function (orderId)
{
  var q = Object.assign({ pair: pair }, options);
  return this.getQuery("/latestExecutions", {
    orderId: orderId,
    page: 1,
    count: 10,
  });
};

GmoPrivate.prototype.getOpenPositions = function (pair, options)
{
  var q = Object.assign({ pair: pair }, options);
  return this.getQuery("/openPositions", {
    symbol: pair,
  });
};

GmoPrivate.prototype.getPositionSummary = function (pair)
{
  return this.getQuery("/positionSummary", {
    symbol: pair,
    page: 1,
    count: 10,
  });
};

GmoPrivate.prototype.order = function (
  pair,
  side,
  type,
  price,
  losscutPrice,
  amount,
)
{
  return this.postQuery("/order", {
    symbol: pair,
    side: side,
    executionType: type,
    price: price,
    losscutPrice: losscutPrice,
    size: amount,
  });
};

GmoPrivate.prototype.changeOrder = function (orderId, price, losscutPrice)
{
  return this.postQuery("/changeOrder", {
    orderId: orderId,
    price: price,
    losscutPrice: losscutPrice,
  });
};

GmoPrivate.prototype.cancelOrder = function (orderId)
{
  return this.postQuery("/cancelOrder", {
    orderId: orderId,
  });
};

GmoPrivate.prototype.closeOrder = function (
  pair,
  side,
  type,
  price,
  positionId,
  amount,
)
{
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

GmoPrivate.prototype.closeBulkOrder = function (pair, price, side, type)
{
  return this.postQuery("/closeBulkOrder", {
    symbol: pair,
    side: side,
    executionType: type,
    price: price,
  });
};

GmoPrivate.prototype.changeLosscutPrice = function (positionId, losscutPrice)
{
  return this.postQuery("/changeLosscutPrice", {
    positionId: positionId,
    losscutPrice: losscutPrice,
  });
};

GmoPrivate.prototype.getWsAuth = function ()
{
  return this.postQuery("/ws-auth", {});
};
