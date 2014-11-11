angular.module('markdown', [])
  .directive('markdown', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, controller) {
        element.html(marked(element.html()));
      }
    };

});
