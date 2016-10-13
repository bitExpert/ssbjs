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
    preLoaders: [
      {
        test: /\.ts$/,
        loader: "tslint"
      }
    ],
    loaders: [
      {
        test: /\.ts/,
        loader: 'babel-loader!ts-loader'
      },
    ]
  },
  tslint: {
      formatter: "stylish",

      // tslint errors are displayed by default as warnings
      // set emitErrors to true to display them as errors
      emitErrors: false,

      // tslint does not interrupt the compilation by default
      // if you want any file with tslint errors to fail
      // set failOnHint to true
      failOnHint: true
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
    modulesDirectories: ['src', 'node_modules'],
  },
  plugins: plugins
};

module.exports = config;
