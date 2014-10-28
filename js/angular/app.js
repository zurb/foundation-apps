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
    'foundation.accordion',
    'foundation.notification',
    'foundation.actionsheet'
  ])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlProvider, $locationProvider) {

    $urlProvider.otherwise('/');

    var complexViews = {};

    angular.forEach(dynamicRoutes, function(page) {
      if (page.hasComposed == true) {
        if (!angular.isDefined(complexViews[page.parent])) {
          complexViews[page.parent] = { children: {} };
        }

        complexViews[page.parent]['children'][page.name] = page;
      } else if (page.composed == true) {
        if(!angular.isDefined(complexViews[page.name])) {
          complexViews[page.name] = { children: {} };
        }

        angular.extend(complexViews[page.name], page);
      } else {
        var state = {
          url: page.url,
          templateUrl: page.path,
          parent: page.parent || '',
          controller: page.controller || 'DefaultController',
          data: { vars: page },
        };

        $stateProvider.state(page.name, state);
      }
    });

    angular.forEach(complexViews, function(page) {
        var state = {
          url: page.url,
          parent: page.parent || '',
          data: { vars: page },
          views: { '': {
              templateUrl: page.path,
              controller: page.controller || 'DefaultController',
            }
          }
        };

        angular.forEach(page.children, function(sub) {
          state.views[sub.name + '@' + page.name] = {
            templateUrl: sub.path,
            controller: page.controller || 'DefaultController',
            };
        });

        $stateProvider.state(page.name, state);
    });

    $locationProvider.html5Mode(true);
}])
  .run(['FoundationInit', function(foundationInit) {
    foundationInit.init();
}]);

