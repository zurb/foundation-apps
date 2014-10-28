angular.module('foundation.popup', []);

angular.module('foundation.popup')
  .directive('faPopup', ['FoundationApi', function(foundationApi) {
    return {
      transclude: true,
      templateUrl: '/partials/popup.html',
      scope: {
        title: '@',
        footer: '@?'
      },
      link: function(scope, element, attrs) {
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
}]);
