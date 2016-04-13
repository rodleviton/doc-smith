var angular = require('angular');

// Load the components
var modA = require('my_components/components/componentAlpha');
var modB = require('my_components/components/componentBeta');
var modC = require('my_components/components/componentGamma');
var modD = require('my_components/components/componentDelta');
var modE = require('my_components/components/componentEpsilon');

module.exports = (function () {
   var mod = angular.module('app', [modA, modB, modC, modD, modE]);
})();
