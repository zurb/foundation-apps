angular.module('application')
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

angular.module('application')
  .controller('NavController', ['$scope', '$state', function($scope, $state) {
    $scope.current = $state.current.name;

    //setup autocomplete
    $scope.routing = [];
    $scope.typedText = '';

    if(foundationRoutes) {
      angular.forEach(foundationRoutes, function(r) {
        $scope.routing.push(r.name.replace('.', ' '));
      });
    }

    $scope.selectRoute = function(r) {
      $state.go(r.replace(' ', '.'));
    };
  }
]);
