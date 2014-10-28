angular.module('foundation.actionsheet', []);

angular.module('foundation.actionsheet')
  .directive('faActionSheet', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: '/partials/actionsheet.html',
    scope: {
      target: '@?',
      position: '@?'
    },
    link: function(scope, element, attrs, controller) {
      scope.active = false;

      //setup
      foundationApi.subscribe(attrs.id, function(msg) {
        if(msg == 'show' || msg == 'open') {
          scope.show();
        } else if (msg == 'close' || msg == 'hide') {
          scope.hide();
        } else if (msg == 'toggle') {
          scope.toggle();
        }

        scope.$apply();

        return;
      });

      scope.hide = function() {
        scope.active = false;
        return;
      };

      scope.show = function() {
        scope.active = true;
        return;
      };

      scope.toggle = function() {
        scope.active = !scope.active;
        return;
      };
    },
  };
}]);
