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

var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    rimraf      = require('rimraf'),
    runSequence = require('run-sequence'),
    modRewrite  = require('connect-modrewrite'),
    routes      = require('./bin/gulp-dynamic-routing'),
    merge       = require('merge-stream'),
    octophant   = require('octophant')
;

var addVersions = function() {
  var pkg = require('./package.json');
  return $.rename(function(path) {
    // Inject the version number into the filename
    var base = path.basename.split('.');
    if (base.length === 1) {
      base = base + '-' + pkg.version;
    }
    else {
      base = base.slice(0, -1).join('') + '-' + pkg.version + '.' + base[base.length - 1];
    }
    path.basename = base;
    path.dirname = '';
  });
};

// 2. VARIABLES
// - - - - - - - - - - - - - - -

var paths = {
  html: {
    base: [
      './docs/**/*.*',
      '!./docs/templates/**/*.*',
      '!./docs/assets/{scss,js}/**/*.*'
    ],
    templates: [
      './docs/templates/**/*.html'
    ],
    partials: [
      'js/angular/components/**/*.html'
    ]
  },
  sass: {
    loadPaths: [
      'scss',
      'docs/assets/scss'
    ],
    testPaths: [
      'scss',
      'docs/assets/scss',
      'bower_components/bootcamp/dist'
    ]
  },
  javascript: {
    foundation: [
      'js/vendor/**/*.js',
      'js/angular/**/*.js',
      '!js/angular/app.js'
    ],
    libs: [
      'bower_components/fastclick/lib/fastclick.js',
      'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
      'bower_components/tether/tether.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/hammerjs/hammer.js'
    ],
    docs: [
      'bower_components/marked/lib/marked.js',
      'bower_components/angular-highlightjs/angular-highlightjs.js',
      'bower_components/highlightjs/highlight.pack.js',
      'bower_components/allmighty-autocomplete/script/autocomplete.js',
      'docs/assets/js/app.js'
    ]
  }
};

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

// Clean the dist directory
gulp.task('clean:dist', function(cb) {
  rimraf('./dist', cb);
});

// 4. COPYING FILES
// - - - - - - - - - - - - - - -

// Copy static files (but not the Angular templates, Sass, or JS)
gulp.task('copy', function() {
  gulp.src(paths.html.base, {
    base: './docs/'
  })
    .pipe(gulp.dest('build'));

  return gulp.src('./iconic/**/*')
    .pipe(gulp.dest('build/assets/img/iconic/'));
});

// Copy page templates and generate routes
gulp.task('copy:templates', ['javascript'], function() {
  var config = [];

  return gulp.src(paths.html.templates)
    .pipe(routes({
      path: 'build/assets/js/routes.js',
      root: 'docs'
    }))
    .pipe(gulp.dest('./build/templates'))
  ;
});

// Copy Foundation directive partials
gulp.task('copy:partials', ['clean:partials'], function(cb) {
  gulp.src(paths.html.partials)
    .pipe($.ngHtml2js({
      prefix: 'components/',
      moduleName: 'foundation',
      declareModule: false
    }))
    .pipe($.uglify())
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('./build/assets/js'));

  gulp.src('./docs/partials/**/*.html')
    .pipe(gulp.dest('./build/partials/'));

  cb();
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
    .pipe($.concat('app.css'))
    .pipe(gulp.dest('build/assets/css'))
  ;
});

// Compile stylesheets
gulp.task('sass', function() {
  var filter = $.filter(['*.css']);

  return gulp.src('docs/assets/scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass.loadPaths,
      outputStyle: 'nested',
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('./build/assets/css/'));
});

// Generate Sass settings file
gulp.task('sass:settings', function() {
  octophant([
    'scss/_includes.scss',
    'scss/_global.scss',
    'scss/helpers/_breakpoints.scss',
    'scss/components/_typography.scss',
    'scss/components/_grid.scss',
    'scss/components/_button.scss',
    'scss/components/*.scss'
  ], {
    title: 'Foundation for Apps Settings'.toUpperCase(),
    partialsPath: 'docs/partials/scss',
    settingsPath: 'scss'
  });
});

// 6. JAVASCRIPT
// - - - - - - - - - - - - - - -

// Compile Foundation JavaScript
gulp.task('javascript', function() {
  var dirs = paths.javascript.libs.concat(
    paths.javascript.foundation,
    paths.javascript.docs
  );
  return gulp.src(dirs)
    .pipe($.uglify({
      beautify: true,
      mangle: false
    }).on('error', function(e) {
      console.log(e);
    }))
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

// 7. SERVER
// - - - - - - - - - - - - - - -

gulp.task('server:start', function() {
  $.connect.server({
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

gulp.task('test:karma', ['build', 'sass'], function() {
  var testFiles = [
    'build/assets/js/foundation.js',
    'build/assets/js/dependencies.js',
    'build/assets/js/app.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/jsdiff/diff.js',
    'build/assets/css/app.css',
    'build/assets/css/app_node.css',
    'tests/unit/common/*Spec.js'
  ];

  return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    })
  ;

});

gulp.task('test:sass', function() {
  return $.rubySass('./tests/unit/scss/tests.scss', {
    loadPath: paths.sass.testPaths,
    style: 'nested',
    bundleExec: true
  })
    .on('data', function(data) {
      console.log(data.contents.toString());
    });
});

gulp.task('test', ['test:karma', 'test:sass'], function() {
  console.log('Tests finished.');
});

// Motion testing

gulp.task('test:motion:compile', ['clean', 'sass', 'javascript'], function() {
  gulp.src('./tests/motion/index.html')
    .pipe(gulp.dest('./build'));
  gulp.src('./tests/motion/templates/**/*.html')
    .pipe(routes({
      path: 'build/assets/js/routes.js',
      root: 'tests/motion'
    }))
    .pipe(gulp.dest('./build/templates'));
});

gulp.task('test:motion', ['server:start', 'test:motion:compile'], function() {
  gulp.watch(['js/**/*', 'tests/motion/**/*'], ['test:motion:compile']);
});

// 9. DEPLOYMENT
// - - - - - - - - - - - - - - -

// Deploy distribution files
gulp.task('deploy:dist', ['clean:dist'], function(cb) {
  var filter = $.filter(['*.css']);

  gulp.src('scss/foundation.scss')
    .pipe($.sass({
      outputStyle: 'nested',
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe($.rename('foundation-apps.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe($.minifyCss())
    .pipe($.rename('foundation-apps.min.css'))
    .pipe(gulp.dest('./dist/css'));

  gulp.src(paths.javascript.foundation)
    .pipe($.concat('foundation-apps.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe($.uglify())
    .pipe($.rename('foundation-apps.min.js'))
    .pipe(gulp.dest('./dist/js'));

  gulp.src(paths.html.partials)
    .pipe($.ngHtml2js({
      prefix: 'components/',
      moduleName: 'foundation',
      declareModule: false
    }))
    .pipe($.concat('foundation-apps-templates.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe($.uglify())
    .pipe($.rename('foundation-apps-templates.min.js'))
    .pipe(gulp.dest('./dist/js'))

  cb();
});

// Deploy documentation
gulp.task('deploy:docs', ['build'], function() {
  return gulp.src('build/**')
    .pipe($.prompt.confirm("Make sure everything looks good before you deploy."))
    .pipe($.rsync({
      root: 'build',
      hostname: 'deployer@72.32.134.77',
      destination: '/home/deployer/sites/foundation-apps/current'
    }));
});

// Deploy to CDN
gulp.task('deploy:cdn', ['deploy:dist'], function() {
  return gulp.src('./dist/**/*', {base:'./dist/'})
    .pipe($.filter(['**/*.css', '**/*.js']))
    .pipe(addVersions())
    .pipe($.rsync({
      hostname: 'deployer@72.32.134.77',
      destination: '/home/deployer/sites/foundation-apps-cdn/current',
      relative: false
    }));
});

// 10. NOW BRING IT TOGETHER
// - - - - - - - - - - - - - - -

// Build the documentation once
gulp.task('build', function(cb) {
  runSequence('clean', ['copy', 'copy:partials', 'css', 'javascript', 'copy:templates'], function() {
    cb();
  });
});

// Build the documentation, start a test server, and re-compile when files change
gulp.task('default', ['build', 'server:start'], function() {

  // Watch static files
  gulp.watch(paths.html.base, ['copy']);

  // Watch Angular templates
  gulp.watch(paths.html.templates, ['copy:templates']);

  // Watch Angular partials
  gulp.watch(paths.html.partials, ['copy:partials']);

  // Watch Sass
  gulp.watch(['./docs/assets/scss/**/*', './scss/**/*'], ['css']);

  // Watch JavaScript
  gulp.watch(paths.javascript.foundation.concat(paths.javascript.docs), ['javascript']);
});
