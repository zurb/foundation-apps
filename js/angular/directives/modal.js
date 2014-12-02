angular.module('foundation.modal', ['foundation.common.services']);

angular.module('foundation.modal')
  .directive('zfModal', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: 'partials/modal.html',
    transclude: true,
    scope: {
      overlay: '@',
      overlayClose: '@'
    },
    replace: true,
    compile: function compile(tElement, tAttrs, transclude) {
      var type = 'modal';

      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {
          iAttrs.$set('zf-closable', type);
        },
        post: function postLink(scope, element, attrs) {
          var dialog = angular.element(element.children()[0]);

          scope.active = false;
          scope.overlay = scope.overlay || scope.overlayClose || false;
          scope.overlayClose = scope.overlayClose || false;

          var animationIn = attrs.animationIn || 'fadeIn';
          var animationOut = attrs.animationOut || 'fadeOut';
          var overlayIn = 'fadeIn';
          var overlayOut = 'fadeOut';

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

          var animate = function() {
            if(scope.overlay) {
              //animate both overlay and dialog
              foundationApi.animate(element, scope.active, overlayIn, overlayOut);
              foundationApi.animate(dialog, scope.active, animationIn, animationOut);
            } else {
              foundationApi.animate(element, scope.active, overlayIn, overlayOut);
            }
          }

          scope.hide = function() {
            scope.active = false;
            animate();
            return;
          };

          scope.show = function() {
            scope.active = true;
            animate();
            return;
          };

          scope.toggle = function() {
            scope.active = !scope.active;
            animate();
            return;
          };
        }
      };
    },
  };
}]);
