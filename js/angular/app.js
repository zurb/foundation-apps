(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(['$urlRouterProvider', '$locationProvider', function($urlProvider, $locationProvider) {
      $urlProvider.otherwise('/');

      $locationProvider.html5Mode({
        enabled:false,
        requireBase: false
      });

      $locationProvider.hashPrefix('!');
  }])
    .run(function() {
      FastClick.attach(document.body);
  });

})();
