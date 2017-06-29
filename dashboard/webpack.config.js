var path = require("path");

module.exports = {
  entry: {
    "health": "./static/js/src/health.js",
    "timeseries": "./static/js/src/projectTimeSeries.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./static/js/dist")
  }
};
