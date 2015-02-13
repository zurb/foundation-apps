(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'ngSVGAttributes',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:true,
      requireBase: false
    });
  }
  
  run.$inject = ['$rootScope', '$location', '$compile'];

  function run($rootScope, $location, $compile) {
    FastClick.attach(document.body);
    
    if ($location.$$html5) {
      $rootScope.$on('$zfIconicInjected', function(event, injectedElem) {
        var angElem = angular.element(injectedElem);
        $compile(angElem.contents())(angElem.scope());
      });
    }
  }

})();
