const path = require('path');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index.js'),
    content: path.resolve(__dirname, 'src/content.js'),
    options: path.resolve(__dirname, 'src/options.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.frag$/, loader: 'raw-loader', exclude: /node_modules/ },
    ],
  },
};
