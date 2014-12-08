angular.module('application')
  .controller('DefaultController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
    $scope.params  = angular.copy($stateParams);
    $scope.current = $state.current.name;
    $scope.vars    = $state.current.data.vars;

    if ($state.current.views) {
      $scope.composed = $state.current.data.vars.children;
    }
  }
]);

angular.module('application')
  .controller('NavController', ['$scope', '$state', function($scope, $state) {
    var routes = angular.copy(foundationRoutes);

    $scope.selectRoute = function(routeName) {
      var title = routeName;
      var name = routeName.replace(' ', '.');

      //search for route
      angular.forEach(routes, function(r) {
        if (r.title && r.title === routeName) {
          $state.go(r.name);
          return;
        }
        if (name === r.name) {
          $state.go(r.name);
          return;
        }
      });
    };

    $scope.current = $state.current.name;

    //setup autocomplete
    $scope.typedText = '';
    $scope.routing = routes.map(function(r) {
      return r.title || r.name.replace('.', ' ');
    });
  }
]);

