angular.module('foundation.popup', []);

angular.module('foundation.popup')
  .directive('faPopup', ['FoundationApi', function(foundationApi) {
    return {
      transclude: true,
      templateUrl: '/partials/popup.html',
      scope: {
        pinTo: '@?',
        pinAt: '@?'
      },
      link: function(scope, element, attrs) {
        scope.pinTo = scope.pinTo || 'bottom';
        scope.target = scope.target || false;
        var tetherInit = false;

        var tether = {};

        var tetherElement = function(target) {
          if(tetherInit) {
            return;
          }

          scope.target = scope.target ? document.getElementById(scope.target) : document.getElementById(target);

          console.log(element, 'element');
          console.log(scope.target, 'target');

          tether = new Tether({
            element: element[0],
            target: scope.target,
            attachment: scope.pinTo,
            enable: false,
          })

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
          tetherElement(newTarget);
          tether.disable();
          return;
        };

        scope.show = function(newTarget) {
          scope.active = true;
          tetherElement(newTarget);
          tether.enable();

          return;
        };

        scope.toggle = function(newTarget) {
          scope.active = !scope.active;
          tetherElement(newTarget);

          if(scope.active) {
            tether.enable();
          } else  {
            tether.disable();
          }

          return;
        };
      }
    };
}]);

angular.module('foundation.popup')
  .directive('faPopupToggle', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var target = attrs.faPopupToggle;
        var id = attrs.id || foundationApi.generateUuid();

        element.on('click', function(e) {
          foundationApi.publish(target, ['toggle', attrs.id]);
          e.preventDefault();
        });

      }
    };
}]);
