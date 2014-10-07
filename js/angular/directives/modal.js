angular.module('foundation.modal', []);

angular.module('foundation.modal')
  .directive('faModal', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    templateUrl: '/partials/modal.html',
    transclude: true,
    scope: {
      src: '@'
    },
    replace: true,
    compile: function compile(tElement, tAttrs, transclude) {
      var type = 'modal';

      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {
          iAttrs.$set('fa-closable', type);
        },
        post: function postLink(scope, element, attrs) {
          var dialog = angular.element(element.children()[0]);
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
            dialog.removeClass('is-active');
            element.removeClass('is-active');
            currentStatus = 'hide';
            return;
          }

          scope.show = function() {
            dialog.addClass('is-active');
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
