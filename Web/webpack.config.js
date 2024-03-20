const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.mjs', '.js']
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-modules']
          }
        }
      }
    ]
  }
};
