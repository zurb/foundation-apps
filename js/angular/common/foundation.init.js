angular.module('foundation.init', ['foundation.common.services']);

angular.module('foundation.init.state', ['ui.router'])
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
