var Dgeni = require('dgeni');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * A Metalsmith plugin to generate jsdoc style comments from source code comments
 *
 * @return {Function}
 */

function plugin() {
  return function (files, metalsmith, done) {
    var dgeni = new Dgeni([require('./build.js')]);
    
    dgeni.generate().then(function (docs) {
      done();
    });
  };
}
