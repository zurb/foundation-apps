var gulp           = require('gulp'),
    rimraf         = require('rimraf'),
    runSequence    = require('run-sequence'),
    frontMatter    = require('gulp-front-matter'),
    autoprefixer   = require('gulp-autoprefixer'),
    sass           = require('gulp-ruby-sass'),
    libsass        = require('gulp-sass'),
    uglify         = require('gulp-uglify'),
    concat         = require('gulp-concat'),
    connect        = require('gulp-connect'),
    path           = require('path'),
    modRewrite     = require('connect-modrewrite'),
    dynamicRouting = require('./bin/gulp-dynamic-routing');

// Clean build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

// Copy static files (but not the Angular templates, Sass, or JS)
gulp.task('copy', function() {
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

gulp.task('clean-partials', function(cb) {
  rimraf('./build/partials', cb);
});

gulp.task('copy-partials', ['clean-partials'], function() {
  return gulp.src(['js/angular/partials/**.*'])
    .pipe(gulp.dest('./build/partials/'));
});

// Compile Sass
gulp.task('sass', function() {
  var libs = [
    'client/assets/scss',
    'scss'
  ];

  return gulp.src('client/assets/scss/app.scss')
    .pipe(sass({
      loadPath: libs,
      style: 'expanded',
      lineNumbers: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('./build/assets/css/'))
  ;
});

gulp.task('libsass', function() {
  return gulp.src('client/assets/scss/app.scss')
    .pipe(libsass({
      includePaths: ['client/assets/scss', 'scss'],
      style: 'nested',
      sourceComments: true,
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./build/assets/css/'));
});

// Process Foundation JS
gulp.task('uglify', ['uglify-angular'], function() {
  var libs = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
    'bower_components/notify.js/notify.js',
    'bower_components/tether/tether.js',
    'js/foundation/**/*.js',
    'client/assets/js/app.js'
  ];

  return gulp.src(libs)
    .pipe(uglify({
      beautify: true,
      mangle: false
    }).on('error', function(e) {
      console.log(e);
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

// Process Angular JS
gulp.task('uglify-angular', function() {
  var libs = [
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/ui-router/release/angular-ui-router.js',
    'js/angular/**/*.js',
  ];

  return gulp.src(libs)
    .pipe(uglify({
      beautify: true,
      mangle: false
    }))
    .pipe(concat('angular-app.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;

});

gulp.task('copy-templates', ['copy'], function() {
  var config = [];

  return gulp.src('./client/templates/**/*.html')
    .pipe(dynamicRouting({
      path: 'build/assets/js/routes.js',
      root: 'client'
    }))
    .pipe(gulp.dest('build/templates'))
  ;
});

gulp.task('server:start', function() {
  connect.server({
    root: './build',
    middleware: function() {
      return [
        modRewrite(['^[^\\.]*$ /index.html [L]'])
      ];
    },
  });
});

gulp.task('build', function() {
  runSequence('clean', ['copy', 'copy-partials', 'copy-templates', 'libsass', 'uglify'], function() {
    console.log("Successfully built.");
  })
});

gulp.task('default', ['build', 'server:start'], function() {
  // gulp.watch(['./client/**/*.*', './js/**/*.*'], ['build', 'css', server.restart]);

  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['libsass']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

  // Watch Angular partials
  gulp.watch(['js/angular/partials/**.*'], ['copy-partials']);

  // Watch Angular templates
  gulp.watch(['./client/templates/**/*.html'], ['copy-templates']);
});
