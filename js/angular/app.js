angular.module('application', [
  'ui.router',
  'ngAnimate',
  'foundation.services',
  'foundation.dynamicRouting',
  'foundation.dynamicRouting.animations',
  'foundation.accordion',
  'foundation.actionsheet',
  'foundation.directives',
  'foundation.iconic',
  'foundation.init',
  'foundation.interchange',
  'foundation.modal',
  'foundation.notification',
  'foundation.offcanvas',
  'foundation.panel',
  'foundation.popup',
  'foundation.tabs'
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
