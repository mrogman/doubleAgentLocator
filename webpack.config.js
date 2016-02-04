//var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var path = require('path');

module.exports = {
  context: __dirname,
  entry: './entry.js',
  output: {
    path: __dirname + '/src/main/resources/static/',
    filename: 'bundle.js'
  },
  module: {
    resolve: {
      modulesDirectories: ["node_modules"]
    },
    preLoaders: [
      //{ test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader' }
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/, presets: ['es2015']},
      { test: /[\/]angular\.js$/, loader: "exports?window.angular" },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false' ]
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  jshint: {
    camelcase: true,
    failOnHint: false
  },
  plugins: [
    //new ngAnnotatePlugin({
      //add: true
    //})
  ]
};
