// Base
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var rimraf = require('rimraf');
var basePath = process.cwd() + '/';

// Package
var pkg = require(basePath + 'package.json');

// Webpack
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

// Metalsmith Plugins
var metalsmith = require('metalsmith');
var ngDocs = require('./plugins/ng-docs');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');
var metalsmithWebpack = require('metalsmith-webpack');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
var metalsmithExpress = require('metalsmith-express');
var paths = require('metalsmith-paths');
var beautify = require('metalsmith-beautify');
var discoverHelpers = require('metalsmith-discover-helpers');
var discoverPartials = require('metalsmith-discover-partials');

////////////////////////////////////////////////////////////
// CREATE A PRETTY CLI HEADER
////////////////////////////////////////////////////////////
console.log(chalk.white('-------------------------------------------------------------'));
console.log(chalk.white('|'), chalk.blue('DOC SMITH'));
console.log(chalk.white('|'), chalk.green('v', pkg.version));
console.log(chalk.white('-------------------------------------------------------------'));

////////////////////////////////////////////////////////////
// LOAD DOC-SMITH CONFIG
////////////////////////////////////////////////////////////
if (!fs.readFileSync('./doc-smith.config.json')) {
  console.log(chalk.white('-'), chalk.red('Please make sure you have a', chalk.green('doc-smith.config.json'), 'file!'));
  return;
}

console.log(chalk.white('-'), chalk.green('Reading', chalk.blue('doc-smith.config.json'), 'configuration file...'));
var config = require(basePath + 'doc-smith.config.json');

////////////////////////////////////////////////////////////
// ASSET PIPELINE
////////////////////////////////////////////////////////////
metalsmith(basePath)
  .use(ngDocs())
  .use(markdown())
  .metadata({
    site: {
      title: config.title,
      url: config.url
    }
  })
  .source(config.source)
  .destination(config.destination)
  .use(discoverHelpers({
    directory: 'core/helpers',
    pattern: /\.js$/
  }))
  .use(discoverPartials({
    directory: 'core/templates/partials',
    pattern: /\.hbs$/
  }))
  .use(paths({
    property: 'path'
  }))
  .use(collections(config.collections))
  .use(layouts({
    engine: 'handlebars',
    directory: 'core/templates/layouts'
  }))
  .use(beautify({
    'js': false,
    'html': {
      'wrap_line_length': 180
    }
  }))
  .use(metalsmithWebpack({
    context: path.resolve(basePath),
    entry: {
      docs: './src/docs.js',
      theme: './core/themes/default/theme.js'
    },
    output: {
      path: basePath + 'build/assets/',
      filename: '[name].bundle.js'
    },
    module: {
      loaders: [{
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }, {
        test: /\.(otf|eot|png|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?limit=10000'
      },
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },]
    },
    plugins: [
      new webpack.optimize.DedupePlugin()
      // new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
  }))
  .use(metalsmithExpress({
    port: 3000,
    host: '127.0.0.1'
  }))
  .use(watch({
    paths: {
      '${source}/**/*': true,
      'core/templates/**/*': '**/*',
      'core/themes/**/*': '**/*'
    },
    livereload: true,
  }))
  .build(function (err) {
    if (err) {
      console.log(err);
    } else {
      postCleanup(['./build/docs.js', './build/components', './build/patterns']);
      console.log('Site build complete!');
    }
  });

/**
 * Delete unused files and folders
 * @param  {Araay} paths
 */
var postCleanup = function (paths) {
  paths.forEach(function (path) {
    rimraf(path, {}, function (err) {
      if (err) {
        console.log(chalk.red('Something went wrong with build folder cleanup', err));
      };
    });
  });
}
