angular.module('foundation.offcanvas', ['foundation.common.services']);

angular.module('foundation.offcanvas')
  .directive('zfOffcanvas', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: 'partials/offcanvas.html',
    transclude: true,
    scope: {
      position: '@'
    },
    replace: true,
    compile: function compile(tElement, tAttrs, transclude) {
      var type = 'offcanvas';

      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {
          iAttrs.$set('zf-closable', type);
          document.body.classList.add('has-off-canvas');
        },
        post: function postLink(scope, element, attrs) {
          scope.position = scope.position || 'left';

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
        }
      };
    }
  };
}]);
