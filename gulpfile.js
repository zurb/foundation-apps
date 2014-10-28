var gulp         = require('gulp'),
    rimraf       = require('rimraf'),
    runSequence  = require('run-sequence'),
    frontMatter  = require('gulp-front-matter'),
    path         = require('path'),
    through      = require('through2'),
    fs           = require('fs'),
    autoprefixer = require('gulp-autoprefixer'),
    sass         = require('gulp-ruby-sass'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    connect      = require('gulp-connect'),
    modRewrite = require('connect-modrewrite');

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

gulp.task('copy-templates', ['copy', 'uglify-angular'], function() {
  var config = [];

  return gulp.src('./client/templates/**/*.html')
    .pipe(frontMatter({
      property: 'meta',
      remove: true
    }))
    .pipe(through.obj(function(file, enc, callback) {
      if(file.meta.name) {
        var page = file.meta;

        //path normalizing
        var relativePath = path.relative(__dirname + path.sep + 'client', file.path);
        page.path = '/' + relativePath.split(path.sep).join('/');

        config.push(page);
      }
      this.push(file);
      return callback();
    }))
    .pipe(gulp.dest('build/templates'))
    .on('end', function() {
      //routes
      var appPath = ['build', 'assets', 'js', 'angular-app.js'];
      var data = fs.readFileSync(appPath.join(path.sep));
      config.sort(function(a, b) {
        return a.url < b.url;
      });

      fs.writeFileSync(appPath.join(path.sep), 'var dynamicRoutes = ' + JSON.stringify(config) + '; \n' + data);
    })
  ;
});

gulp.task('server:start', function() {
  server.listen( { path: 'app.js' });


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
  runSequence('clean', ['copy', 'copy-partials', 'copy-templates', 'sass', 'uglify'], function() {
    console.log("Successfully built.");
  })
});

gulp.task('default', ['build', 'server:start'], function() {
  // gulp.watch(['./client/**/*.*', './js/**/*.*'], ['build', 'css', server.restart]);

  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify', 'copy-templates']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

  // Watch Angular partials
  gulp.watch(['js/angular/partials/**.*'], ['copy-partials']);

  // Watch Angular templates
  gulp.watch(['./client/templates/**/*.html'], ['uglify-angular', 'copy-templates']);
});
