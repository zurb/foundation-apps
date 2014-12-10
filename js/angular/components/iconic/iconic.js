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
  .directive('zfIconic', ['Iconic', function(iconic) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      var ico = iconic.getAccess();
      ico.inject(element[0]);
    }
  };
}]);

