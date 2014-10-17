module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      JASMINE,
      JASMINE_ADAPTER,
      'build/assets/js/angular-app.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'test/unit/**/*.spec.js'
    ],

    colors: true,

    logLevel: LOG_INFO,

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor'
            ],

  });
};
