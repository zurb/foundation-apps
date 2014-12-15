(function() {
  'use strict';

  angular.module('foundation.dynamicRouting', ['foundation.services', 'ui.router']);

  angular.module('foundation.dynamicRouting', ['ui.router'])
    .provider('$FoundationState', ['$stateProvider', function($stateProvider) {
    var complexViews = {};

    this.registerDynamicRoutes = function(routes) {
      var dynamicRoutes = routes || foundationRoutes;

      angular.forEach(dynamicRoutes, function(page) {
        if (page.hasComposed) {
          if (!angular.isDefined(complexViews[page.parent])) {
            complexViews[page.parent] = { children: {} };
          }

          if (page.controller) {
            page.controller = getController(page);
          }

          complexViews[page.parent].children[page.name] = page;

        } else if (page.composed) {
          if(!angular.isDefined(complexViews[page.name])) {
            complexViews[page.name] = { children: {} };
          }

          if (page.controller) {
            page.controller = getController(page);
          }

          angular.extend(complexViews[page.name], page);
        } else {
          var state = {
            url: page.url,
            templateUrl: page.path,
            parent: page.parent || '',
            controller: getController(page),
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
            views: {
              '': buildState(page.path, page)
            }
          };

          angular.forEach(page.children, function(sub) {
            state.views[sub.name + '@' + page.name] = buildState(sub.path, page);
          });

          $stateProvider.state(page.name, state);
      });
    };

    this.$get = angular.noop;

    function buildState(path, state) {
      return {
        templateUrl: path,
        controller: getController(state),
      };
    }

    function getController(state) {
      var ctrl = state.controller || 'DefaultController';

      if (!/\w\s+as\s+\w/.test(ctrl)) {
        ctrl += ' as PageCtrl';
      }

      return ctrl;
    }
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
