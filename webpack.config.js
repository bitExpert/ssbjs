var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'ServiceBus';

var plugins = [],
    outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = 'ssb.min.js';
} else {
  outputFile = 'ssb.js';
}

var config = {
  entry: [
      __dirname + '/src/ServiceBus.ts'
  ],
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.ts/,
        loader: 'babel-loader!ts-loader'
      },
    ]
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    modulesDirectories: ['src', 'node_modules'],
  },
  plugins: plugins
};

module.exports = config;
