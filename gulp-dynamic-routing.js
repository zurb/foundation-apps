var through     = require('through2');
var gutil       = require('gulp-util');
var fm          = require('front-matter');
var PluginError = gutil.PluginError;
var path        = require('path');

const PLUGIN_NAME = 'gulp-dynamic-routing';

function gulpDynamicRouting(options) {
  var configs = [];

  function bufferContents(file, enc, cb) {
    var config;

    if(file.isBuffer()) {
      try {
        content = fm(String(file.contents));
      } catch (e) {
        return cb(new gutil.PluginError(PLUGIN_NAME, e));
      }

      file.contents = new Buffer(content.body);
      config = content.attributes;
      var relativePath = path.relative(__dirname + path.sep + options.root, file.path);
      config.path = '/' + relativePath.split(path.sep).join('/');
      configs.push(config);
    }

    this.push(file);

    return cb();
  }

  function endStream() {
    var appPath = options.path;
    var data = fs.readFileSync(appPath);
    configs.sort(function(a, b) {
      return a.url < b.url;
    });

    fs.writeFileSync(appPath, 'var dynamicRoutes = ' + JSON.stringify(configs) + '; \n');

    this.emit('end');
  }

  return through(bufferContents, endStream);
}

module.exports = gulpDynamicRouting;
