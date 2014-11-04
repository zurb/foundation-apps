module.exports = function(config){
  config.set({

    basePath : './',

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
