// Settings parser
// This gulp task pulls the settings files out of 

var concat    = require('gulp-concat')  
var extend    = require('util')._extend;
var format    = require('util').format;
var gulp      = require('gulp');
var ignore    = require('gulp-ignore');
var inject    = require('gulp-inject-string');
var map       = require('vinyl-map');
var multiline = require('multiline');
var order     = require('gulp-order');
var through   = require('through2');

var sassFiles = [
  'scss/_global.scss',
  'scss/helpers/_breakpoints.scss',
  'scss/components/_typography.scss',
  'scss/components/_grid.scss',
  'scss/components/*.scss'
];

var titleText = multiline(function() {/*
//
//  FOUNDATION FOR APPS SETTINGS
//  ----------------------------
//
//  Table of Contents:
//
*/});

var parseSettings = function(options) {
  var i = 0;

  options = extend({
    start:   "\/\/\/ @Foundation.settings",
    end:     "\/\/\/",
    comment: true
  }, options);

  return map(function(contents, filename) {
    // Convert the file to a string
    contents = contents.toString().replace(/(?:\r\n)/mg, "\n");

    // Find the variable text
    var re = new RegExp("(?:"+options.start+"\n)((.|\n)*)(?:\n"+options.end+")", "mg");
    var match = re.exec(contents);
    if (match === null) return '';

    i++;

    // Extract the name of the component and the text (variables) between the comments
    var componentName     = match[1].split('\n')[0].slice(3);
    var componentContents = match[1].split('\n').slice(1).map(function(val) {
      // Keep empty lines how they are
      if (val.length === 0) return val;
      // Keep comment lines how they are
      if (val.indexOf('//') === 0) return val;
      // Add comments to CSS lines and remove the !default expression
      if (options.comment) return ("// "+val).replace(" !default", "");

      return val;
    }).join('\n');

    // Add the name and number of the component to the table of contents
    titleText = titleText + '\n' + format("//  %d.%s%s", i, i > 9 ? ' ' : '  ', componentName);

    var output = multiline.stripIndent(function() {/*
      // %d. %s
      // - - - - - - - - - - - - - - -

      %s2
    */});

    output = format(output, i, componentName, componentContents, "\n");

    return output;
  });
};

module.exports = function() {
  gulp.src(sassFiles)
    .pipe(parseSettings())
    // .pipe(order(fileOrder))
    .pipe(ignore.exclude(function(file) {
      return file.contents.length === 0;
    }))
    .pipe(concat('_settings.scss'))
    .pipe(map(function(contents, filename) {
      return titleText + '\n\n' + contents.toString();
    }))
    .pipe(gulp.dest('.'));
}