const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "bin"),
    filename: "app.bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        loader: "style!css?modules",
      },
      {
        test: /\.html$/,
        loader: "babel!es6-template-string",
      },
    ],
  },
  externals: [
    {"window": "window"},
  ],
};