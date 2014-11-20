angular.module('foundation.actionsheet', ['foundation.common.services']);

angular.module('foundation.actionsheet')
  .controller('ZfActionSheetController', ['$scope', 'FoundationApi', function($scope, foundationApi) {
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
  .directive('zfActionSheet', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    templateUrl: '/partials/actionsheet.html',
    controller: 'ZfActionSheetController',
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
  .directive('zfAsContent', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: '/partials/actionsheet-content.html',
    require: '^zfActionSheet',
    scope: {
      position: '@?'
    },
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
  .directive('zfAsButton', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: '/partials/actionsheet-button.html',
    require: '^zfActionSheet',
    scope: {
      title: '@?'
    },
    link: function(scope, element, attrs, controller) {

      element.on('click', function(e) {
        controller.toggle();
        e.preventDefault();
      });

    },
  };
}]);
