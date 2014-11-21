angular.module('foundation.notification', ['foundation.common.services']);

angular.module('foundation.notification')
  .controller('ZfNotificationController', ['$scope', 'FoundationApi', function ZfTabsController($scope, foundationApi) {
    var controller    = this;
    var notifications = controller.notifications = $scope.notifications = [];

    controller.addNotification = function(info) {
      var id  = foundationApi.generateUuid();
      info.id = id;
      notifications.push(info);
    };

    controller.removeNotification = function(id) {
      notifications.forEach(function(notification) {
        if(notification.id === id) {
          var ind = notifications.indexOf(notification);
          notifications.splice(ind, 1);
        }
      });
    };

    controller.clearAll = function() {
      notifications = [];
    };

}]);

angular.module('foundation.notification')
  .directive('zfNotificationSet', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: '/partials/notification-set.html',
    controller: 'ZfNotificationController',
    link:function(scope, element, attrs, controller) {
      foundationApi.subscribe(attrs.id, function(msg) {
        if(msg === 'clearall') {
          controller.clearAll();
        } else {
          controller.addNotification(msg);
        }

        scope.$apply();
      });

    },
  };
}]);

angular.module('foundation.notification')
  .directive('zfNotification', function() {
  return {
    restrict: 'EA',
    templateUrl: '/partials/notification.html',
    replace: true,
    transclude: true,
    require: '^zfNotificationSet',
    controller: function() { },
    scope: {
      title: '=?',
      content: '=?',
      image: '=?',
      notifId: '=',
      position: '=?',
      color: '=?'
    },
    link: function(scope, element, attrs, controller) {
      scope.active = false;
      scope.position = scope.position ? scope.position.split(' ').join('-') : '';
      attrs.$set('zf-closable', 'notification');

      //allow DOM to change before activating
      setTimeout(function() {
        scope.active = true;
        scope.$apply();
      }, 50);

      scope.remove = function() {
        scope.active = false;
        setTimeout(function() {
          controller.removeNotification(scope.notifId);
        }, 50);
      };
    },
  };
});

angular.module('foundation.notification')
  .directive('zfNotificationStatic', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: '/partials/notification.html',
    replace: true,
    transclude: true,
    scope: {
      title: '@?',
      content: '@?',
      image: '@?',
      position: '@?',
      color: '@?'
    },
    link: function(scope, element, attrs, controller) {
      scope.position = scope.position ? scope.position.split(' ').join('-') : '';

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

      scope.remove = function() { scope.hide(); };

      scope.show = function() {
        scope.active = true;
        return;
      };

      scope.toggle = function() {
        scope.active = !scope.active;
        return;
      };

    },
  };
}]);

angular.module('foundation.notification')
  .directive('zfNotify', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    scope: {
      title: '@?',
      content: '@?',
      position: '@?',
      color: '@?',
      image: '@?'
    },
    link: function(scope, element, attrs, controller) {
      element.on('click', function(e) {
        e.preventDefault();
        foundationApi.publish(attrs.zfNotify, { title: scope.title, content: scope.content, position: scope.position, color: scope.color });
      });
    },
  };
}]);
