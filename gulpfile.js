var gulp         = require('gulp'),
    rimraf       = require('gulp-rimraf'),
    server       = require('gulp-develop-server'),
    frontMatter  = require('gulp-front-matter'),
    path         = require('path')
    through      = require('through2')
    fs           = require('fs')
    autoprefixer = require('gulp-autoprefixer'),
    sass         = require('gulp-ruby-sass'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat');

//prefix
gulp.task('prefix', ['sass'], function() {
  return gulp.src('./build/assets/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('build/assets'))
  ;
});

// clean folders
gulp.task('clean', function(cb) {
  return gulp.src(['./dist', './build'])
    .pipe(rimraf())
  ;
});

//copy files
gulp.task('copy', ['clean'], function() {
  return gulp.src(['./client/**/*.*', '!./client/templates/**/*.*'], { base: './client/' } )
    .pipe(gulp.dest('build'));
});

gulp.task('copy2', ['clean'], function() {
  return gulp.src(['./src/assets/**.*', '!**/*.js', '!**/*.scss'], { base: './src/assets/'})
    .pipe(gulp.dest('dist/assets'))
  ;
});

//ruby sass
gulp.task('sass', ['clean', 'copy'], function() {
  return gulp.src('scss/app.scss')
    .pipe(sass({ loadPath: ['scss', 'scss/foundation'] }))
    .pipe(concat('dist/assets/css/app.css'))
  ;
});

//uglify and concat
gulp.task('uglify', ['copy', 'clean'], function() {
  var libs = ['bower_components/jqlit/jqlite.1.1.1.js', 'bower_components/fastlickc/lib/fastclick.js', 'bower_components/notify.js/notify.js', 'bower_components/tether/tether.js', 'js/foundation.js', 'js/foundation.modal.js', 'js/foundation.notification.js', 'js/foundation.offcanvas.js', 'js/foundation.popup.js', 'js/app.js'];

  return gulp.src(libs)
    .pipe(uglify({
      beautify: true,
      mangle: false
    }))
    .pipe(concat('dist/assets/js/all.js'))
  ;
});

gulp.task('uglify-angular', ['front-matter', 'copy', 'clean'], function() {
  var libs = ['bower_components/angular/angular.js', 'bower_components/angular-animate/angular-animate.js', 'bower_components/ui-router/release/angular-ui-router.js', 'build/assets/js/*.js'];

  return gulp.src(libs)
    .pipe(uglify({
      beautify: true,
      mangle: false
    }))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./build/assets/js/'))
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

gulp.task('build', ['clean', 'copy', 'copy2', 'uglify','uglify-angular', 'front-matter'], function() {
  console.log('Successfully built');
});

gulp.task('css', ['build', 'sass', 'prefix'], function() {
  console.log('CSS Recompiled');
});

gulp.task('default', ['build', 'css', 'server:start'], function() {
  gulp.watch(['./client/**/*.*', './src/**/*.*'], ['build', server.restart]);
  gulp.watch('./scss/**/*.*', ['build', 'css', server.restart]);
});
