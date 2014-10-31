angular.module('foundation.actionsheet', []);

angular.module('foundation.actionsheet')
  .controller('FaActionSheetController', ['$scope', 'FoundationApi', function($scope, foundationApi) {
    var controller = this;
    var content = controller.content = $scope.content;

    controller.registerContent = function(scope) {
      content = scope;
      content.active = false;
    };

    controller.toggle = function() {
      content.toggle();
      content.$apply();
    };

}]);

angular.module('foundation.actionsheet')
  .directive('faActionSheet', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: '/partials/actionsheet.html',
    controller: 'FaActionSheetController',
    link: function(scope, element, attrs, controller) {
      foundationApi.subscribe(attrs.id, function(msg) {
        if (msg == 'toggle') {
          controller.toggle();
        }

        return;
      });
    }
  };
}]);

angular.module('foundation.actionsheet')
  .directive('faAsContent', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: '/partials/actionsheet-content.html',
    require: '^faActionSheet',
    scope: {
      position: '@?'
    },
    controller: function() { },
    link: function(scope, element, attrs, controller) {
      scope.active = false;
      controller.registerContent(scope);

      scope.toggle = function() {
        scope.active = !scope.active;
        return;
      };
    },
  };
}]);

angular.module('foundation.actionsheet')
  .directive('faAsButton', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: '/partials/actionsheet-button.html',
    require: '^faActionSheet',
    scope: {
      title: '@?'
    },
    controller: function() { },
    link: function(scope, element, attrs, controller) {

      element.on('click', function(e) {
        controller.toggle();
        e.preventDefault();
      });

    },
  };
}]);
