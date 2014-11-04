angular.module('foundation.iconic', []);

//iconic wrapper
angular.module('foundation.iconic')
  .service('Iconic', function() {
    var iconic = IconicJS();

    return {
      getAccess: function() {
        return iconic;
      }
    };
});

angular.module('foundation.iconic')
  .directive('faIconic', ['Iconic', function(iconic) {
  return {
    restrict: 'EA',
    transclude: true,
    templateUrl: '/partials/actionsheet.html',
    controller: 'FaActionSheetController',
    link: function(scope, element, attrs, controller) {
      var iconic = iconic.getAccess();

      iconic.inject(element.children());
    }
  };
}]);

