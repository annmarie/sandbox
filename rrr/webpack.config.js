// - webpack config - //
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'assets'),
  output: {
    path: path.resolve(__dirname, 'gen'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      }
    ]
  }
}
