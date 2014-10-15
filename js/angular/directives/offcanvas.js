angular.module('foundation.offcanvas', []);

angular.module('foundation.offcanvas')
  .directive('faOffcanvas', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: '/partials/offcanvas.html',
    transclude: true,
    scope: {
      position: '@'
    },
    replace: true,
    compile: function compile(tElement, tAttrs, transclude) {
      var type = 'offcanvas';

      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {
          iAttrs.$set('fa-closable', type);
          iElement.addClass('ofc-' + scope.position);
          document.body.classList.add('has-off-canvas');
        },
        post: function postLink(scope, element, attrs) {
          var currentStatus = 'hide';

          //setup
          foundationApi.subscribe(attrs.id, function(msg) {
            if(msg == 'show' || msg == 'open') {
              scope.show();
            } else if (msg == 'close' || msg == 'hide') {
              scope.hide();
            } else if (msg == 'toggle') {
              scope.toggle();
            }

            return;
          });

          scope.hide = function() {
            element.removeClass('is-active');
            currentStatus = 'hide';
            return;
          }

          scope.show = function() {
            element.addClass('is-active');
            currentStatus = 'show';
            return;
          }

          scope.toggle = function() {
            if(currentStatus == 'show') {
              scope.hide();
              currentStatus = 'hide';
              return;
            }

            scope.show();
            currentStatus = 'show';
            return;
          }
        }
      }
    },
  }
}]);
