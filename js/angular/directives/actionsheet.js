angular.module('foundation.actionsheet', []);

angular.module('foundation.actionsheet')
  .directive('faActionsheet' ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    transclude: true,
    templateUrl: '/partials/actionsheet.html',
    link: function(scope, element, attrs, controller) {

    },
  };
}]);
