module.exports = function(grunt) {
  var hljs = require('highlight.js');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    assemble: {
      options: {
        flatten: false,
        assets: 'dist/assets/',
        data: ['src/data/*.json'],
        marked: {
          gfm: true,
          sanitize: false,
          highlight: function(code, lang) {
            if (lang === undefined) lang = 'bash';
            if (lang === 'html') lang = 'xml';
            if (lang === 'js') lang = 'javascript';
            return '<div class="code-container">' + hljs.highlight(lang, code).value + '</div>';
          }
        }
      },
      dist: {
        options: {
          partials: ['docs/includes/*.html'],
          helpers: ['docs/helpers/*.js'],
          layout: 'docs/layouts/default.html'
        },
        expand: true,
        cwd: 'docs/pages/',
        src: '**/*.html',
        dest: 'dist/'
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 10']
      },
      single_file: {
        expand: true,
        flatten: true,
        src: 'dist/assets/css/src/app.css',
        dest: 'dist/assets/css/'
      }
    },

    sass: {
      options: {
        loadPath: ['scss']
      },
      dist: {
        options: {
          style: 'expanded',
          lineNumbers: 'true'
        },
        files: {
          'dist/assets/css/src/app.css': 'scss/app.scss'
        }        
      }
    },

    copy: {
      dist: {
        files: [
          {expand:true, cwd: 'src/assets/', src: ['**/*','!{scss,js}/**/*'], dest: 'dist/assets/', filter:'isFile'},
          {expand:true, cwd: 'bower_components/modernizr/', src: 'modernizr.js', dest: 'dist/assets/js', filter:'isFile'}
        ]
      }
    },

    uglify: {
      dist: {
        options: {
          mangle: false,
          beautify: true
        },
        files: {
          'dist/assets/js/all.js': [
            // Libraries
            'bower_components/jqlite/jqlite.1.1.1.js',
            'bower_components/fastclick/lib/fastclick.js',
            'bower_components/notify.js/notify.js',
            'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
            'bower_components/tether/tether.js',

            // Our stuff
            'js/foundation.js',
            'js/foundation.modal.js',
            'js/foundation.notification.js',
            'js/foundation.offcanvas.js',
            'js/foundation.popup.js',
            'js/app.js'
          ]
        }
      }
    },

    clean: ['dist/'],

    watch: {
      grunt: { 
        files: ['Gruntfile.js'],
        tasks: ['build'] 
      },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass', 'autoprefixer']
      },

      copy: {
        options: {cwd: 'src/assets/'},
        files: ['**/*','!{scss,js}/**/*'],
        tasks: ['copy']
      },

      uglify: {
        options: {cwd: 'js'},
        files: ['**/*.js'],
        tasks: ['uglify']
      },

      assemble_all: {
        files: ['docs/{includes,layouts}/**/*.html'],
        tasks: ['assemble'],
        options: {livereload:true}
      },

      assemble_pages: {
        files: ['docs/pages/**/*.html'],
        tasks: ['assemble'],
        options: {livereload:true}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('build', ['clean','sass', 'autoprefixer','uglify','assemble','copy']);
  grunt.registerTask('default', ['build','watch']);
}
