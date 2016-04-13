var rimraf = require('rimraf');

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
  return function () {
    rimraf('./build/index.js', {}, function (err) {
      if (err) {
        console.log('Something went wrong with build folder cleanup', err);
      };
    });
  };
}
