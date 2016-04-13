// var postcss = require('postcss');
// var modules = require('postcss-modules');
// var minimatch = require('minimatch');
// var Promise = require('promise');
// var path = require('path');

var fs = require('fs');
var path = require('path');
var minimatch = require('minimatch');
var posthtml = require('posthtml');
var posthtmlCssModules = require('posthtml-css-modules');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * A Metalsmith plugin to hide any files marked as `draft`.
 *
 * @return {Function}
 */

function plugin() {

  return function (files, metalsmith, done) {

    var layoutList = fs.readdirSync('./templates/layouts');

    var templates = layoutList.filter(minimatch.filter("*.hbs", {matchBase: true}));

    console.log(templates);

    if (templates.length == 0) {
      done();
      return;
    }

    templates.forEach(function (file) {
      console.log(file);
      var template = fs.readFileSync('./templates/layouts/' + file, 'utf8');


      posthtml([posthtmlCssModules('./src/assets/css/app.json')])
        .process(template)
        .then(function (result) {
          console.log(result.html);
          file.contents = new Buffer(result.html);
          done();
        });

    });


    // done();
  };
}
