var gulp         = require('gulp'),
    rimraf       = require('rimraf'),
    server       = require('gulp-develop-server'),
    frontMatter  = require('gulp-front-matter'),
    path         = require('path')
    through      = require('through2')
    fs           = require('fs')
    autoprefixer = require('gulp-autoprefixer'),
    sass         = require('gulp-ruby-sass');

//prefix
gulp.task('prefix', ['sass'], function() {
  return gulp.src('./build/assets/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('build/assets'))
  ;
});

// clean folders
gulp.task('clean', function(cb) {
  rimraf(['./build', './dist'], cb);
});

//copy files
gulp.task('copy', ['clean'], function() {
  return gulp.src(['./client/**/*.*', '!./client/templates/**/*.*'], { base: './client/' } )
    .pipe(gulp.dest('build'));
});

//ruby sass
gulp.task('sass', ['clean', 'copy'], function() {
  return gulp.src('scss/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/assets/css/src/app.css'))
  ;
});

gulp.task('front-matter', ['copy'], function() {
  var config = [];

  return gulp.src('./client/templates/*.html')
    .pipe(frontMatter({
      property: 'meta',
      remove: true
    }))
    .pipe(through.obj(function(file, enc, callback) {
      var page = file.meta;

      //path normalizing
      var relativePath = path.relative(__dirname + path.sep + 'client', file.path);
      page.path = relativePath.split(path.sep).join('/');

      config.push(page);

      this.push(file);
      return callback();
    }))
    .pipe(gulp.dest('build/templates'))
    .on('end', function() {
      //routes
      var appPath = ['build', 'assets', 'js', 'app.js'];
      var data = fs.readFileSync(appPath.join(path.sep));
      fs.writeFileSync(appPath.join(path.sep), 'var dynamicRoutes = ' + JSON.stringify(config) + '; \n' + data);
    })
  ;
});

gulp.task('server:start', ['build'], function() {
  server.listen( { path: 'app.js' });
});

gulp.task('build', ['copy', 'front-matter', 'prefix'], function() {
  console.log('Successfully built');
});

gulp.task('default', ['build', 'server:start'], function() {
  gulp.watch('./client/**/*.*', ['build', server.restart]);
});
