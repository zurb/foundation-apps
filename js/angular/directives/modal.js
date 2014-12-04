angular.module('foundation.modal', ['foundation.common.services']);

angular.module('foundation.modal')
  .directive('zfModal', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: 'partials/modal.html',
    transclude: true,
    scope: true,
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
          scope.overlay = attrs.overlay === 'true' || attrs.overlayClose === 'true' ? true : false;
          scope.overlayClose = attrs.overlayClose === 'true' ? true : false;

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
            //animate both overlay and dialog
            if(!scope.overlay) {
              element.css('background', 'transparent');
            }

            foundationApi.animate(element, scope.active, overlayIn, overlayOut);
            foundationApi.animate(dialog, scope.active, animationIn, animationOut);
          };

          scope.hideOverlay = function() {
            if(scope.overlayClose) {
              scope.hide();
            }
          };

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
