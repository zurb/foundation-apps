var through = require('through2');
var gutil   = require('gulp-util');
var fm      = require('front-matter');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-dynamic-routing';

/*
 * OPTIONS
 * destination: saves routes.js to a destination
 */
function gulpDynamicRouting(options) {
  var config = [];

  function bufferContents(file, enc, cb) {
    
  }

  function endStream() {
      config.sort(function(a, b) {
        return a.url < b.url;
      });

      this.emit('data', 'var dynamicRoutes = ' + JSON.stringify(config) + '; \n');

      this.emit('end');
  }

  return through(bufferContents, endStream);
}

module.exports = gulpDynamicRouting;
    //.pipe(frontMatter({
      //property: 'meta',
      //remove: true
    //}))
    //.pipe(through.obj(function(file, enc, callback) {
      //if(file.meta.name) {
        //var page = file.meta;

        ////path normalizing
        //var relativePath = path.relative(__dirname + path.sep + 'client', file.path);
        //page.path = '/' + relativePath.split(path.sep).join('/');

        //config.push(page);
      //}
      //this.push(file);
      //return callback();
    //}))
