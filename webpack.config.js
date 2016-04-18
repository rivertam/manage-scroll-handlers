const webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin,
  ]
};
