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
    restrict: 'AE',
    link: function(scope, element, attrs, controller) {
      var ico = iconic.getAccess();

      console.log(element.children(), 'test');
      ico.inject(element.children());
    }
  };
}]);

