var extend    = require('util')._extend
  , File      = require('vinyl')
  , format    = require('util').format
  , map       = require('vinyl-map')
  , multiline = require('multiline')
  , through   = require('through2');

module.exports = function(options) {
  var i = 1;

  options = extend({
    start: "\/\/\/ @Foundation.settings",
    end:   "\/\/\/"
  }, options);

  return map(function(contents, filename) {
    // Convert the file to a string
    contents = contents.toString().replace(/(?:\r\n)/mg, "\n");

    // Find the variable text
    var re = new RegExp("(?:"+options.start+"\n)((.|\n)*)(?:\n"+options.end+")", "mg");
    var match = re.exec(contents);
    if (match === null) return '';

    var componentName     = match[1].split('\n')[0].slice(3);
    var componentContents = match[1].split('\n').slice(1).map(function(val) {
      // Keep empty lines how they are
      if (val.length === 0) return val;
      // Keep comment lines how they are
      if (val.indexOf('//') === 0) return val;
      // Add comments to CSS lines and remove the !default expression
      return ("// "+val).replace(" !default", "");
    }).join('\n');

    var output = multiline.stripIndent(function() {/*
      // %d. %s
      // - - - - - - - - - - - - - - -

      %s2
    */});

    output = format(output, i++, componentName, componentContents, "\n");

    return output;
  });
};