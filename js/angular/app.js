var app = angular.module('application', [
    'ui.router',
    'ngAnimate',
    'foundation.init',
    'foundation.common.services',
    'foundation.common.directives',
    'foundation.common.animations',
    'foundation.modal',
    'foundation.panel',
    'foundation.offcanvas',
    'foundation.interchange',
    'foundation.tabs',
    'foundation.accordion'
  ])
    .config(['$FoundationStateProvider', '$urlRouterProvider', '$locationProvider', function(FoundationStateProvider, $urlProvider, $locationProvider) {

    $urlProvider.otherwise('/');

    FoundationStateProvider.registerDynamicRoutes();

    $locationProvider.html5Mode(true);
}])
  .run(['FoundationInit', '$rootScope', '$state', '$stateParams', function(foundationInit, $rootScope, $state, $stateParams) {
    foundationInit.init();

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);

