'use strict'

// Foundation for Apps
//
// We use this Gulpfile to assemble the documentation, run unit tests,
// and deploy changes to the live documentation and CDN.
//
// The tasks are grouped into these categories:
//   1. Libraries
//   2. Variables
//   3. Cleaning files
//   4. Copying files
//   5. Stylesheets
//   6. JavaScript
//   7. Testing
//   8. Server
//   9. Deployment
//  10. Default tasks

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var gulp           = require('gulp'),
    rimraf         = require('rimraf'),
    runSequence    = require('run-sequence'),
    markdown       = require('gulp-markdown'),
    highlight      = require('gulp-highlight'),
    autoprefixer   = require('gulp-autoprefixer'),
    sass           = require('gulp-ruby-sass'),
    nodeSass       = require('gulp-sass'),
    uglify         = require('gulp-uglify'),
    concat         = require('gulp-concat'),
    connect        = require('gulp-connect'),
    ngHtml2Js      = require('gulp-ng-html2js'),
    modRewrite     = require('connect-modrewrite'),
    dynamicRouting = require('./bin/gulp-dynamic-routing'),
    karma          = require('gulp-karma'),
    rsync          = require('gulp-rsync'),
    merge          = require('merge-stream'),
    settingsParser = require('settings-parser');

// 2. VARIABLES
// - - - - - - - - - - - - - - -

var foundationJS = [
  'bower_components/fastclick/lib/fastclick.js',
  'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
  'bower_components/tether/tether.js',
  'bower_components/angular/angular.js',
  'bower_components/angular-animate/angular-animate.js',
  'bower_components/ui-router/release/angular-ui-router.js',
  'bower_components/hammerjs/hammer.js',
  'js/vendor/**/*.js',
  'js/angular/**/*.js',
  '!js/angular/app.js'
];
var docsJS = [
  'bower_components/marked/lib/marked.js',
  'bower_components/angular-highlightjs/angular-highlightjs.js',
  'bower_components/highlightjs/highlight.pack.js',
  'bower_components/allmighty-autocomplete/script/autocomplete.js',
  'docs/assets/js/app.js'
];
var directivesJS = [
  'bower_components/fastclick/lib/fastclick.js',
  'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
  'bower_components/tether/tether.js',
  'bower_components/hammerjs/hammer.js',
  'js/vendor/**/*.js',
  'js/angular/vendor/*.js',
  'js/angular/services/**',
  'js/angular/components/**/*.js',
  'js/angular/foundation.js'
];

// 3. CLEANIN' FILES
// - - - - - - - - - - - - - - -

// Clean build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

// Clean the partials directory
gulp.task('clean:partials', function(cb) {
  rimraf('./build/partials', cb);
});

// Clean the compile directory
gulp.task('clean:compile', function(cb) {
  rimraf('./compile', cb);
});

// Clean the leftover files from the compile task
gulp.task('clean:compiled', function(cb) {
  rimraf('./compile/.tmp/', cb);
});

// 4. COPYING FILES
// - - - - - - - - - - - - - - -

// Copy static files (but not the Angular templates, Sass, or JS)
gulp.task('copy', function() {
  var dirs = [
    './docs/**/*.*',
    '!./docs/templates/**/*.*',
    '!./docs/assets/{scss,js}/**/*.*'
  ];
  gulp.src(dirs, {
    base: './docs/'
  })
    .pipe(gulp.dest('build'));

  return gulp.src('./iconic/**/*')
    .pipe(gulp.dest('build/assets/img/iconic/'));
});

// Copy page templates and generate routes
gulp.task('copy:templates', ['copy'], function() {
  var config = [];

  return gulp.src('./docs/templates/**/*.html')
    .pipe(dynamicRouting({
      path: 'build/assets/js/routes.js',
      root: 'docs'
    }))
    .pipe(markdown())
    .pipe(highlight())
    .pipe(gulp.dest('./build/templates'))
  ;
});

// Copy Foundation directive partials
gulp.task('copy:partials', ['clean:partials'], function() {
  return gulp.src(['js/angular/components/**/*.html'])
    .pipe(gulp.dest('./build/components/'));
});

// Copy Foundation directives and turn to JavaScript
gulp.task('copy:compile', ['clean:compile'], function() {
  return gulp.src(['js/angular/components/**/*.html'])
    .pipe(ngHtml2Js({
      prefix: 'components/',
      moduleName: 'foundation',
      declareModule: false
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./compile/.tmp/'));
});

// 5. STYLESHEETS
// - - - - - - - - - - - - - - -

// Inject styles for docs-specific libraries
gulp.task('css', ['sass'], function() {
  var dirs = [
    'bower_components/allmighty-autocomplete/style/autocomplete.css',
    'build/assets/css/app.css'
  ];
  return gulp.src(dirs)
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build/assets/css'))
  ;
});

// Compile stylesheets with Ruby Sass
gulp.task('sass', ['settings'], function() {
  return sass('docs/assets/scss/', {
      loadPath: ['scss'],
      style: 'nested',
      bundleExec: true
    })
    .on('error', function(e) {
      console.log(e);
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('./build/assets/css/'));
});

// Compile stylesheets with node-sass
gulp.task('node-sass', function() {
  return gulp.src('docs/assets/scss/app.scss')
    .pipe(nodeSass({
      includePaths: ['scss'],
      outputStyle: 'nested',
      errLogToConsole: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(concat('app_node.css'))
    .pipe(gulp.dest('./build/assets/css/'));
});

// Generate Sass settings file
gulp.task('settings', function() {
  return settingsParser([
    'scss/_includes.scss',
    'scss/_global.scss',
    'scss/helpers/_breakpoints.scss',
    'scss/components/_typography.scss',
    'scss/components/_grid.scss',
    'scss/components/*.scss'
  ]);
});

// 6. JAVASCRIPT
// - - - - - - - - - - - - - - -

// Compile Foundation JavaScript
gulp.task('javascript', function() {
  return gulp.src(foundationJS)
    .pipe(uglify({
      beautify: true,
      mangle: false
    }).on('error', function(e) {
      console.log(e);
    }))
    .pipe(concat('foundation.js'))
    .pipe(gulp.dest('./build/assets/js/'));
});

// Compile documentation-specific JavaScript
gulp.task('javascript:docs', function() {
  return gulp.src(docsJS)
    .pipe(uglify({
      beautify: true,
      mangle: false
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/'));
});

// Compile directive-specific JavaScript
gulp.task('javascript:directives', function() {
  return gulp.src(directivesJS)
    .pipe(concat('directives.js'))
    .pipe(gulp.dest('./compile/.tmp/'));
});

// Compile templates and directives JavaScript
gulp.task('javascript:compile', function() {
  var compileFiles = [
    './compile/.tmp/directives.js',
    './compile/.tmp/templates.js'
  ];

  return gulp.src(compileFiles)
    .pipe(concat('foundation-tpls.js'))
    .pipe(gulp.dest('./compile/'));
});

// Compile templates and directives plus minify JavaScript
gulp.task('javascript:compileMinify', function() {
  var compileFiles = [
    './compile/.tmp/directives.js',
    './compile/.tmp/templates.js'
  ];

  return gulp.src(compileFiles)
    .pipe(concat('foundation-tpls-min.js'))
    .pipe(uglify({
      beautify: true,
      mangle: false
    }))
    .pipe(gulp.dest('./compile/'));
});

// 7. SERVER
// - - - - - - - - - - - - - - -

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

// 8. TESTING
// - - - - - - - - - - - - - - -

gulp.task('karma:test', ['build', 'node-sass'], function() {
  var testFiles = [
    'build/assets/js/foundation.js',
    'build/assets/js/app.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/jsdiff/diff.js',
    'build/assets/css/app.css',
    'build/assets/css/app_node.css',
    'tests/unit/common/*Spec.js'
  ];

  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    })
  ;

});

gulp.task('sass:test', function() {
  sass('./tests/unit/scss/tests.scss', {
    loadPath: ['scss', 'docs/assets/scss', 'bower_components/bootcamp/dist'],
    style: 'nested',
    bundleExec: true
   })
    .pipe(gulp.dest('tests/unit/scss'));
});

gulp.task('test', ['karma:test', 'sass:test'], function() {
  console.log('Tests finished.');
});

// 9. DEPLOYMENT
// - - - - - - - - - - - - - - -

// Deploy documentation
gulp.task('deploy', ['build'], function() {
  return gulp.src('build/**')
    .pipe(rsync({
      root: 'build',
      hostname: 'deployer@72.32.134.77',
      destination: '/home/deployer/sites/foundation-apps/current'
    }));
});

// Deploy to CDN
gulp.task('deploy:cdn', ['build'], function() {
  var js = gulp.src(foundationJS)
    .pipe(uglify())
    .pipe(concat('foundation.js'));
  var css = sass('scss/', {
    sourcemap: false, style: 'compressed'
  });

  merge(js, css)
    .pipe(rsync({
      hostname: 'deployer@72.32.134.77',
      destination: '/home/deployer/sites/foundation-apps/current/cdn'
    }));
});

// 10. NOW BRING IT TOGETHER
// - - - - - - - - - - - - - - -

// Build the documentation once
gulp.task('build', function(cb) {
  runSequence('clean', ['copy', 'copy:partials', 'css', 'javascript', 'javascript:docs'], 'copy:templates', function() {
    console.log('Successfully built.');
    cb();
  });
});

// Build the documentation, start a test server, and re-compile when files change
gulp.task('default', ['build', 'server:start'], function() {

  // Watch static files
  gulp.watch(['./docs/**/*.*', '!./docs/templates/**/*.*', '!./docs/assets/{scss,js}/**/*.*'], ['copy']);

  // Watch Angular templates
  gulp.watch(['docs/templates/**/*.html'], ['copy:templates']);

  // Watch Angular partials
  gulp.watch(['js/angular/components/**/**.html'], ['copy:partials']);

  // Watch Sass
  gulp.watch(['./docs/assets/scss/**/*', './scss/**/*'], ['css']);

  // Watch JavaScript
  gulp.watch(['./docs/assets/js/**/*', './js/**/*'], ['javascript']);
});

// Compile all directives into a single file with templates
gulp.task('compile', function(cb) {
  runSequence('clean:compile', ['copy:compile', 'javascript:directives'], ['javascript:compile', 'javascript:compileMinify'], 'clean:compiled');
});
