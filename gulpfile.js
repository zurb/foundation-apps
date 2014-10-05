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

// Auto-prefix that Sass
gulp.task('prefix', ['sass'], function() {
  return gulp.src('./build/assets/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('build/assets'))
  ;
});

// Clean build directory
gulp.task('clean', function(cb) {
  return gulp.src(['./dist', './build'])
    .pipe(rimraf())
  ;
});

// Copy static files (but not the Angular templates, Sass, or JS)
gulp.task('copy', ['clean'], function() {
  var dirs = [
    './client/**/*.*',
    '!./client/templates/**/*.*',
    '!./client/assets/{scss,js}/**/*.*'
  ];
  return gulp.src(dirs, {
    base: './client/'
  })
    .pipe(gulp.dest('build'));
});

// Compile Sass
gulp.task('sass', ['clean', 'copy'], function() {
  return gulp.src('client/assets/scss/app.scss')
    .pipe(sass({ loadPath: ['client/asets/scss', 'scss'], style: 'expanded', lineNumbers: true  }))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./build/assets/css/'))
  ;
});

// Process Foundation JS
gulp.task('uglify', ['copy', 'clean'], function() {
  var libs = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
    'bower_components/notify.js/notify.js',
    'bower_components/tether/tether.js',
    'js/foundation/**/*.js',
    'client/js/app.js'
  ];

  return gulp.src(libs)
    .pipe(uglify({
      beautify: true,
      mangle: false
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

// Process Angular JS
gulp.task('uglify-angular', ['copy', 'clean'], function() {
  var libs = [
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/ui-router/release/angular-ui-router.js',
    'js/angular/*.js'
  ];

  return gulp.src(libs)
    .pipe(uglify({
      beautify: true,
      mangle: false
    }))
    .pipe(concat('angular.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;

});

// Parse view settings (name, route, animation) from template files
gulp.task('front-matter', ['copy', 'sass', 'uglify-angular'], function() {
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

gulp.task('build', ['clean', 'copy', 'uglify','uglify-angular', 'front-matter'], function() {
  console.log('Successfully built');
});

gulp.task('css', ['build', 'sass', 'prefix'], function() {
  console.log('CSS Recompiled');
});

gulp.task('default', ['build', 'css', 'server:start'], function() {
  gulp.watch(['./client/**/*.*', './src/**/*.*'], ['build', server.restart]);
  gulp.watch('./scss/**/*.*', ['build', 'css', server.restart]);
});

