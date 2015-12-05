(function() {
  'use strict';

  angular.module('foundation.dynamicRouting', ['ui.router'])
    .provider('$FoundationState', FoundationState)
    .controller('DefaultController', DefaultController)
    .config(DynamicRoutingConfig)
    .run(DynamicRoutingRun)
  ;

  FoundationState.$inject = ['$stateProvider'];

  function FoundationState($stateProvider) {
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
            abstract: page.abstract || false,
            parent: page.parent || '',
            controller: getController(page),
            data: getData(page),
            animation: buildAnimations(page),
          };
          
          $stateProvider.state(page.name, state);
        }
      });

      angular.forEach(complexViews, function(page) {
          var state = {
            url: page.url,
            parent: page.parent || '',
            abstract: page.abstract || false,
            data: getData(page),
            animation: buildAnimations(page),
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
    
    function getData(page) {
      var data = { vars: {} };
      if (page.data) {
        if (typeof page.data.vars === "object") {
          data.vars = page.data.vars;
        }
        delete page.data.vars;
        angular.extend(data, page.data);
      }
      delete page.data;
      angular.extend(data.vars, page);
      return data;
    }
    
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

    function buildAnimations(state) {
      var animations = {};

      if (state.animationIn) {
        animations.enter = state.animationIn;
      }

      if (state.animationOut) {
        animations.leave = state.animationOut;
      }

      return animations;
    }
  }

  DefaultController.$inject = ['$scope', '$stateParams', '$state'];

  function DefaultController($scope, $stateParams, $state) {
    var params = {};
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

  DynamicRoutingConfig.$inject = ['$FoundationStateProvider'];

  function DynamicRoutingConfig(FoundationStateProvider) {
    // Don't error out if Front Router is not being used
    var foundationRoutes = window.foundationRoutes || [];

    FoundationStateProvider.registerDynamicRoutes(foundationRoutes);
  }

  DynamicRoutingRun.$inject = ['$rootScope', '$state', '$stateParams'];

  function DynamicRoutingRun($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }

})();
