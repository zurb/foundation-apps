angular.module('foundation.notification', []);

angular.module('foundation.notification')
  .controller('FaNotificationController', ['$scope', 'FoundationApi', function FaTabsController($scope, foundationApi) {
    var controller = this;
    var notifications = controller.notifications = $scope.notifications = [];

    controller.addNotification = function(info) {
      var id = foundationApi.generateUuid();
      info.id = id;
      notifications.push(info);
    };

    controller.removeNotification = function(id) {
      console.log('test', id);
      angular.forEach(notifications, function(notification) {
        if(notification.id === id) {
          var ind = notifications.indexOf(notification);
          notifications.splice(ind, 1);
          console.log(notifications);
        }
      });
    };

    controller.clearAll = function() {
      notifications = [];
    };

}]);

angular.module('foundation.notification')
  .directive('faNotificationSet', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: '/partials/notification-set.html',
    controller: 'FaNotificationController',
    link:function postLink(scope, element, attrs, controller) {
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
  .directive('faNotification', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    templateUrl: '/partials/notification.html',
    replace: true,
    require: '^faNotificationSet',
    controller: function() { },
    scope: {
      title: '=?',
      content: '=?',
      image: '=?',
      notifId: '=',
      onEnter: '&?',
      onExit: '&?'
    },
    link: function(scope, element, attrs, controller) {
      if(scope.onEnter) {
        scope.onEnter();
      }

      console.log(attrs.notifId, 'attrs');
      console.log(scope.notifId, 'scope');

      scope.remove = function() {
        if(scope.onExit) { scope.onExit(); }
        controller.removeNotification(scope.notifId);
      };
    },
  };
}]);

angular.module('foundation.notification')
  .directive('faNotify', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.faNotify, { title: 'Test', content: 'Test2' });
        e.preventDefault();
      });
    },
  };
}]);
