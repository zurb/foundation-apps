angular.module('foundation.popup', ['foundation.common.services']);

angular.module('foundation.popup')
  .directive('zfPopup', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: 'partials/popup.html',
      scope: {
        pinTo: '@?',
        pinAt: '@?',
      },
      link: function(scope, element, attrs) {
        scope.active = false;
        scope.target = scope.target || false;
        attrs.$set('zf-closeable', 'popup');

        var attachment = scope.pinTo || 'top center';
        var tetherInit = false;
        var tether     = {};
        var body       = angular.element(document.body);

        //crude disable
        var listenerEnable = function() {
          setTimeout(function() {
            body.one('click', function(e) {
              scope.hide();
            });
          }, 1);
        };

        var tetherElement = function(target) {
          if(tetherInit) {
            return;
          }

          scope.target = scope.target ? document.getElementById(scope.target) : document.getElementById(target);

          tether = new Tether({
            element: element[0],
            target: scope.target,
            attachment: attachment,
            enable: false
          });

          tetherInit = true;
        };

        //setup
        foundationApi.subscribe(attrs.id, function(msg) {
          if(msg[0] === 'show' || msg[0] === 'open') {
            scope.show(msg[1]);
          } else if (msg[0] === 'close' || msg[0] === 'hide') {
            scope.hide();
          } else if (msg[0] === 'toggle') {
            scope.toggle(msg[1]);
          }

          scope.$apply();

          return;
        });


        scope.hide = function() {
          scope.active = false;
          tether.destroy();
          return;
        };

        scope.show = function(newTarget) {
          scope.active = true;
          tetherElement(newTarget);
          tether.enable();
          listenerEnable();

          return;
        };

        scope.toggle = function(newTarget) {
          scope.active = !scope.active;
          tetherElement(newTarget);

          if(scope.active) {
            scope.show();
          } else  {
            scope.hide();
          }

          return;
        };
      }
    };
}]);

angular.module('foundation.popup')
  .directive('zfPopupToggle', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var target = attrs.zfPopupToggle;
        var id = attrs.id || foundationApi.generateUuid();
        attrs.$set('id', id);

        element.on('click', function(e) {
          foundationApi.publish(target, ['toggle', id]);
          e.preventDefault();
        });

      }
    };
}]);
