angular.module('foundation.notification', []);

angular.module('foundation.notification')
  .controller('FaNotificationController', ['$scope', 'FoundationApi', function FaTabsController($scope, foundationApi) {
    var controller = this;
    var notifications = controller.notifications = $scope.notifications = [];

    controller.addNotification = function(info) {
      var id = foundationApi.generateUuid();
      info.id = id;
      notifications[id] = info;
    };

    controller.removeNotification = function(id) {
      delete notifications[id];
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
    scope: true,
    controller: 'FaTabsController',
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
    scope: {
      title: '&?',
      body: '&?',
      image: '&?',
      notifId: '&',
      onEnter: '@?',
      onExit: '@?'
    },
    link: function(scope, element, attrs, controller) {
      if(scope.onEnter) {
        scope.onEnter();
      }

      scope.remove = function() {
        if(scope.onExit) { scope.onExit(); }
        controller.removeTab(scope.notifId);
      };
    },
  };
}]);
