angular.module('foundation.notification', []);

angular.module('foundation.notification')
  .directive('faNotification', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    templateUrl: '/partials/notification.html',
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
          var type = 'notification';
          var currentStatus = 'hide';

          //setup
          foundationApi.subscribe(type, attrs.id, function(msg) {
            if(msg == 'show') {
              scope.show();
            } else if (msg == 'hide' || msg == 'close') {
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

angular.module('foundation.notification')
  .directive('faNotificationOpen', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var type = 'notification';
      element.on('click', function(e) {
        foundationApi.publish(type, attrs.faNotificationOpen, 'show');
        e.preventDefault();
      });
    }
  }
}]);
