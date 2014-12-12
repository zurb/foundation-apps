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
