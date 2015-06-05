var bourbon = require('node-bourbon').includePaths;
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var baseConfig = function(options) {
  var plugins = [];
  var styleLoaders = [
    { test: /\.css$/, loader: "css" },
    { test: /\.s(a|c)ss$/, loader: "css!sass?includePaths[]="+bourbon }
  ];
  styleLoaders.forEach(function(item) {
    // if array normalize to string
    if(Array.isArray(item.loader)) {
      item.loader = item.loader.join("!");
    }

    if(options.prerender) {
      item.loader = ExtractTextPlugin.extract('style-loader', item.loader);
    } /*else if (options.prerender) {
      item.loader = 'null';
    }*/ else {
      item.loader = 'style!'+item.loader;
    }
  });

  // plugins.push(new webpack.DefinePlugin({
  //   "__production": options.production,
  // }));

  var cssPlugin = new ExtractTextPlugin("bundle.css");
  var entry = {"home": "./js/index.jsx"};
  var externals = {};
  var output = {
    path: 'build',
    publicPath: '/build/',
    filename: '[name].js',
  }

  if (options.prerender) {
    // generate docs.js, for use in populating the prerendered document
    plugins.push(
      cssPlugin,
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      })
    );
    entry = {"prerenderHtml": "./prerenderHtml"};
    output.libraryTarget = "commonjs2";
  }

  return {
    __extra: {
      cssPlugin: cssPlugin
    },
    entry: entry,
    output: output,
    resolve: {
      alias: { lib: __dirname+'/js/lib' },
      extensions: ['', '.js', '.jsx']
    },
    plugins: plugins,
    externals: externals,
    module: {
      loaders: styleLoaders.concat([
        { test: /\.html$/, loader: 'html' },
        { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader"},
        { test: /\.woff($|\?)/,   loader: "url?limit=10000&mimetype=application/font-woff" },
        { test: /\.woff2($|\?)/,  loader: "url?limit=10000&mimetype=application/font-woff2" },
        { test: /\.ttf($|\?)/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
        { test: /\.eot($|\?)/,    loader: "file" },
        { test: /\.svg($|\?)/,    loader: "url?limit=10000&mimetype=image/svg+xml" },
        { test: /\.png($|\?)/,    loader: "url?limit=10000&mimetype=image/png" },
        { test: /\.jpg($|\?)/,    loader: "url?limit=10000&mimetype=image/jpeg" },
        { test: /\.ico($|\?)/,    loader: "url?limit=10000&mimetype=image/x-icon" }
      ])
    }
  }

}

module.exports = baseConfig;