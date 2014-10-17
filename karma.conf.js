module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'build/assets/js/app.js',
      'build/assets/js/angular-app.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'tests/unit/**/*Spec.js'
    ],

    colors: true,

    port: 9876,

    reporters: ['progress'],

    logLevel: config.LOG_INFO,

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            ],

  });
};
