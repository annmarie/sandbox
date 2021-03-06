// - webpack config - //
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'static/app'),
  output: {
    path: path.resolve(__dirname, 'static/gen'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ["env"]
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      }
    ]
  }
}
