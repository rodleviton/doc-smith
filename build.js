var rimraf = require('rimraf');
var path = require('path');
var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');
var webpack = require('metalsmith-webpack');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
var metalsmithExpress = require('metalsmith-express');
var paths = require('metalsmith-paths');
var beautify = require('metalsmith-beautify');
var discoverHelpers = require('metalsmith-discover-helpers');
var discoverPartials = require('metalsmith-discover-partials');
var ngDocs = require('./plugins/ng-docs');
var config = require('./doc-smith.config.json');

metalsmith(__dirname)
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
    directory: 'helpers',
    pattern: /\.js$/
  }))
  .use(discoverPartials({
    directory: 'templates/partials',
    pattern: /\.hbs$/
  }))
  .use(paths({
    property: 'path'
  }))
  .use(collections(config.collections))
  .use(layouts({
    engine: 'handlebars',
    directory: 'templates/layouts'
  }))
  .use(beautify({
    'js': false,
    'html': {
      'wrap_line_length': 180
    }
  }))
  .use(webpack({
    context: path.resolve(__dirname),
    entry: {
      docs: './src/docs.js',
      theme: './themes/default/theme.js'
    },
    output: {
      path: path.resolve(__dirname, './build/assets/'),
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
      }]
    }
  }))
  .use(metalsmithExpress({
    port: 3000,
    host: '127.0.0.1'
  }))
  .use(watch({
    paths: {
      '${source}/**/*': true,
      'templates/**/*': '**/*',
      'themes/**/*': '**/*'
    },
    livereload: true,
  }))
  .build(function (err) {
    if (err) {
      console.log(err);
    } else {
      postCleanup(['./build/assets/js/index.js', './build/components', './build/patterns']);
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
        console.log('Something went wrong with build folder cleanup', err);
      };
    });
  });
}
