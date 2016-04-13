// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');
var fs = require('fs');
var basePath = process.cwd() + '/';

var Package = require('dgeni').Package;

////////////////////////////////////////////////////////////
// LOAD DOC-SMITH CONFIG
////////////////////////////////////////////////////////////
if (!fs.readFileSync('./doc-smith.config.json')) {
  return;
}

var config = require(basePath + '/doc-smith.config.json');

////////////////////////////////////////////////////////////
// DGENI PARSING SOURCE FILE COMMENTS
////////////////////////////////////////////////////////////
// Create and export a new Dgeni package called docs-platform. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = new Package('docs-platform', [
  require('dgeni-packages/ngdoc'),
  require('dgeni-packages/nunjucks')
]).processor(require('./services/encode'))

// Configure our docs-platform package. We can ask the Dgeni dependency injector
// to provide us with access to services and processors that we wish to configure
.config(function (log, readFilesProcessor, templateFinder, writeFilesProcessor) {
    // Set logging level
    log.level = 'info';

    // Specify the base path used when resolving relative paths to source and output files
    readFilesProcessor.basePath = path.resolve(basePath);

    // Specify collections of source files that should contain the documentation to extract
    readFilesProcessor.sourceFiles = [{
      // Process all js files in `src` and its subfolders ...
      include: config.plugins.ngDocs.pattern,
      // ... except for this one!
      // exclude: 'src/do-not-read.js',
      // When calculating the relative path to these files use this as the base path.
      // So `src/foo/bar.js` will have relative path of `foo/bar.js`
      basePath: 'src'
    }];

    // Add a folder to search for our own templates to use when rendering docs
    templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

    // Specify how to match docs to templates.
    // In this case we just use the same static template for all docs
    templateFinder.templatePatterns = [
      'component.template.html'
    ];

    // Specify where the writeFilesProcessor will write our generated doc files
    writeFilesProcessor.outputFolder = config.plugins.ngDocs.destination;
  })
  .config(function (computePathsProcessor, createDocMessage) {
    computePathsProcessor.pathTemplates.push({
      docTypes: ['directive'],
      pathTemplate: '${name}',
      outputPathTemplate: '${name}.html'
    });
  });
