angular.module('foundation.panel', ['foundation.common.services']);

angular.module('foundation.panel')
  .directive('zfPanel', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: 'partials/panel.html',
    transclude: true,
    scope: {
      position: '@?'
    },
    replace: true,
    compile: function compile(tElement, tAttrs, transclude) {
      var type = 'panel';

      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {
          iAttrs.$set('zf-closable', type);
        },
        post: function postLink(scope, element, attrs) {
          var animationIn, animationOut;
          scope.position = scope.position || 'left';
          scope.active = false;

          //urgh, there must be a better way
          if(scope.position === 'left') {
            animationIn  = attrs.animationIn || 'slideInRight';
            animationOut = attrs.animationOut || 'slideOutLeft';
          } else if (scope.position === 'right') {
            animationIn  = attrs.animationIn || 'slideInLeft';
            animationOut = attrs.animationOut || 'slideOutRight';
          } else if (scope.position === 'top') {
            animationIn  = attrs.animationIn || 'slideInDown';
            animationOut = attrs.animationOut || 'slideOutUp';
          } else if (scope.position === 'bottom') {
            animationIn  = attrs.animationIn || 'slideInUp';
            animationOut = attrs.animationOut || 'slideOutBottom';
          }


          //setup
          foundationApi.subscribe(attrs.id, function(msg) {
            if(msg == 'show' || msg == 'open') {
              scope.show();
            } else if (msg == 'close' || msg == 'hide') {
              scope.hide();
            } else if (msg == 'toggle') {
              scope.toggle();
            }

            foundationApi.animate(element, scope.active, animationIn, animationOut);

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
    },
  };
}]);
