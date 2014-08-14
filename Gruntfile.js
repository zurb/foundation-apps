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
          partials: ['src/includes/*.html'],
          helpers: ['src/helpers/*.js'],
          layout: 'src/layouts/default.html'
        },
        expand: true,
        cwd: 'src/pages/',
        src: '**/*.html',
        dest: 'dist/'
      },
      docs: {
        options: {
          partials: ['src/includes/*.html'],
          helpers: ['src/helpers/*.js'],
          layout: 'src/layouts/docs.html'
        },
        expand: true,
        cwd: 'src/pages/',
        src: '**/index.html',
        dest: 'docs/'
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
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
        // includePaths: [ 'bower_components/normalize-css/normalize.scss' ]
      },
      dist: {
        options: {
          style: 'expanded',
          lineNumbers: 'true'
        },
        files: {
          'dist/assets/css/src/app.css': 'src/assets/scss/app.scss'        }        
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
        files: {
          'dist/assets/js/all.js': ['bower_components/jquery/dist/jquery.js', 'bower_components/foundation/js/foundation.js', 'src/assets/js/*']
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
        files: 'src/assets/scss/**/*.{scss,sass}',
        tasks: ['sass', 'autoprefixer']
      },

      copy: {
        options: {cwd: 'src/assets/'},
        files: ['**/*','!{scss,js}/**/*'],
        tasks: ['copy']
      },

      uglify: {
        options: {cwd: 'src/assets/js'},
        files: ['**/*.js'],
        tasks: ['uglify']
      },

      assemble_all: {
        files: ['src/{includes,layouts}/**/*.html'],
        tasks: ['assemble'],
        options: {livereload:true}
      },

      assemble_pages: {
        files: ['src/pages/**/*.html'],
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
  // grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('build', ['clean','sass', 'autoprefixer','uglify','assemble','copy']);
  grunt.registerTask('default', ['build','watch']);
}
