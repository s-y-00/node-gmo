var gmo = require("../");

var api = gmo.publicApi();
api.getTicker("BTC_JPY ").then(function(res) {
  console.log(res);
});
// api.getDepth("BTC_JPY ").then(function(res) {
//   console.log(res);
// });
// api.getTransactions("BTC_JPY ").then(function(res) {
//   console.log(res);
// });
// api.getTransactions("BTC_JPY ", 20170329).then(function(res) {
//   console.log(res);
// });
// api.getCandlestick("BTC_JPY ", "1day", 2017).then(function(res) {
//   console.log(res.candlestick[0].ohlcv);
// });

// var api2 = gmo.privateApi("your_api_key", "your_api_secret");
// api2.getAsset().then(function(res) {
//   console.log(res);
// });
// api2.getOrder("BTC_JPY ", 90956209).then(function(res) {
//   console.log(res);
// });
// api2.getActiveOrders("BTC_JPY ", { count: 1 }).then(function(res) {
//   console.log(res);
// });
// api2.order("BTC_JPY ", 10800, 0.01, "buy", "limit").then(function(res) {
//   console.log(res);
// });
// api2.cancelOrder("BTC_JPY ", 105718369).then(function(res) {
//   console.log(res);
// });
// api2.cancelOrders("BTC_JPY ", [105724841, 105724810]).then(function(res) {
//   console.log(res);
// });
