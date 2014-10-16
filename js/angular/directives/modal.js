angular.module('foundation.modal', []);

angular.module('foundation.modal')
  .directive('faModal', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: '/partials/modal.html',
    transclude: true,
    scope: true,
    replace: true,
    compile: function compile(tElement, tAttrs, transclude) {
      var type = 'modal';

      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {
          iAttrs.$set('fa-closable', type);
        },
        post: function postLink(scope, element, attrs) {
          var dialog = angular.element(element.children()[0]);
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
    },
  };
}]);
