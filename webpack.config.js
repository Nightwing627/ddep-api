const path = require('path');

module.exports = {
  entry: 'app.js',

  output: {
    path: path.resolve('dist'),
    filename: 'app.js'
  },

  module: {
    rules: [{
        test: /\.js$/,
        use: 'babel-loader'
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
    preLoaders: [
        { test: /\.json$/, loader: 'json'}
    ],
  }
};