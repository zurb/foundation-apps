angular.module('application')
  .filter('prepareRoute', function() {
      return function(input) {
        return 'route-' + input.replace(/\./, '-').toLowerCase();
      };
});

angular.module('application')
  .factory('Utils', function() {
    return {
      prepareRoute: function(input) {
        return 'route-' + input.replace(/\./, '-').toLowerCase();
      }
    }
});
