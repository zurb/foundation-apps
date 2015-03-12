var through     = require('through2');
var gutil       = require('gulp-util');
var fm          = require('front-matter');
var PluginError = gutil.PluginError;
var path        = require('path');
var fs           = require('fs');

module.exports = function(options) {
  var configs = [];
  var directory = options.dir || process.cwd();

  function bufferContents(file, enc, cb) {
    var config;
    var content;

    if(file.isNull()) return cb(null, file);

    if(file.isBuffer()) {
      try {
        content = fm(String(file.contents));
      } catch (e) {
        return cb(new PluginError('Gulp Dynamic Routing', e));
      }

      if(content.attributes.name) {
        file.contents = new Buffer(content.body);
        config = content.attributes;
        var relativePath = path.relative(directory + path.sep + options.root, file.path);
        config.path = relativePath.split(path.sep).join('/');
        configs.push(config);
      }
    }

    this.push(file);

    return cb();
  }

  function endStream(cb) {
    var self = this;
    var appPath = options.path;

    configs.sort(function(a, b) {
      return a.url < b.url;
    });


    fs.writeFile(appPath, 'var foundationRoutes = ' + JSON.stringify(configs) + '; \n', function(err) {
      if(err) throw err;
      cb();
    });

  }

  return through.obj(bufferContents, endStream);
};
