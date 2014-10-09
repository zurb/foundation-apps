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
      },
      throttle:function (func, delay) {
        var timer = null;

        return function () {
          var context = this, args = arguments;

          if (timer == null) {
            timer = setTimeout(function () {
              func.apply(context, args);
              timer = null;
            }, delay);
          }
        };
      }
    }
});
