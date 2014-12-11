(function() {
  'use strict';

  angular.module('foundation.dynamicRouting', ['foundation.services', 'ui.router']);

  angular.module('foundation.dynamicRouting', ['ui.router'])
    .provider('$FoundationState', ['$stateProvider', function($stateProvider) {
      var complexViews = {};

      this.registerDynamicRoutes = function(routes) {
        var dynamicRoutes = routes || foundationRoutes;
        angular.forEach(dynamicRoutes, function(page) {
          if (page.hasComposed === true) {
            if (!angular.isDefined(complexViews[page.parent])) {
              complexViews[page.parent] = { children: {} };
            }

            complexViews[page.parent].children[page.name] = page;
          } else if (page.composed === true) {
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
      };

      this.$get = function() {
        return {};
      };
  }]);

  angular.module('foundation.dynamicRouting')
    .controller('DefaultController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
      var params = [];
      angular.forEach($stateParams, function(value, key) {
        params[key] = value;
      });

      $scope.params = params;
      $scope.current = $state.current.name;

      if($state.current.views) {
        $scope.vars = $state.current.data.vars;
        $scope.composed = $state.current.data.vars.children;
      } else {
        $scope.vars = $state.current.data.vars;
      }
    }
  ]);

  angular.module('foundation.dynamicRouting')
    .config(['$FoundationStateProvider', function(FoundationStateProvider) {
      FoundationStateProvider.registerDynamicRoutes(foundationRoutes);
  }])
    .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
  }]);

})();
