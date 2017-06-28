var path = require("path");

module.exports = {
  entry: {
    "health": "./project/js/src/health.js",
    "timeseries": "./project/js/src/projectTimeSeries.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./project/js/dist")
  }
};
