angular.module('application')
  .controller('DefaultController', ['$scope', '$stateParams', '$state', 'Utils', function($scope, $stateParams, $state, u) {
    var params = [];
    angular.forEach($stateParams, function(value, key) {
      params[key] = value;
    });

    $scope.params = params;
    $scope.current = $state.current.name;
    $scope.currentSlug = u.prepareRoute($state.current.name);

    if($state.current.views) {
      $scope.vars = $state.current.data.vars;
      $scope.composed = $state.current.data.vars.children;
    } else {
      $scope.vars = $state.current.data.vars;
    }
  }
]);

angular.module('application')
  .controller('MainController', ['$scope', '$state', 'Utils', function($scope, $state, u) {
    $scope.current = $state.current.name;
    $scope.currentSlug = u.prepareRoute($state.current.name);
  }
]);
