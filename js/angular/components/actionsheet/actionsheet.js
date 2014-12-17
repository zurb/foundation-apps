(function() {
  'use strict';

  angular.module('foundation.actionsheet', ['foundation.core'])
    .controller('ZfActionSheetController', zfActionSheetController)
    .directive('zfActionSheet', zfActionSheet)
    .directive('zfAsContent', zfAsContent)
    .directive('zfAsButton', zfAsButton)
  ;

  zfActionSheetController.$inject = ['$scope', 'FoundationApi'];

  function zfActionSheetController($scope, foundationApi) {
    var controller = this;
    var content = controller.content = $scope.content;
    var container = controller.container = $scope.container;

    controller.registerContent = function(scope) {
      content = scope;
      content.active = false;
    };

    controller.registerContainer = function(scope) {
      container = scope;
      container.active = false;
    };

    controller.toggle = function() {
      content.toggle();
      container.toggle();

      content.$apply();
      container.$apply();
    };

    controller.hide = function() {
      content.hide();
      container.hide();

      content.$apply();
      container.$apply();
    };
  }

  zfActionSheet.$inject = ['FoundationApi'];

  function zfActionSheet(foundationApi) {
    var directive = {
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: 'components/actionsheet/actionsheet.html',
      controller: 'ZfActionSheetController',
      compile: compile
    };

    return directive;

    function compile() {

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs) {
        iAttrs.$set('zf-closable', 'actionsheet');
      }

      function postLink(scope, element, attrs, controller) {
        var id = attrs.id || foundationApi.generateUuid();
        attrs.$set('id', id);

        scope.active = false;

        foundationApi.subscribe(id, function(msg) {
          if (msg === 'toggle') {
            controller.toggle();
          }

          if (msg === 'hide' || msg === 'close') {
            controller.hide();
          }

        });

        controller.registerContainer(scope);

        scope.toggle = function() {
          scope.active = !scope.active;
          return;
        };

        scope.hide = function() {
          scope.active = false;
          return;
        };
      }
    }
  }

  zfAsContent.$inject = ['FoundationApi'];

  function zfAsContent(foundationApi) {
    var directive = {
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: 'components/actionsheet/actionsheet-content.html',
      require: '^zfActionSheet',
      scope: {
        position: '@?'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      scope.active = false;
      scope.position = scope.position || 'bottom';
      controller.registerContent(scope);

      scope.toggle = function() {
        scope.active = !scope.active;
        return;
      };

      scope.hide = function() {
        scope.active = false;
        return;
      };
    }
  }

  zfAsButton.$inject = ['FoundationApi'];

  function zfAsButton(foundationApi) {
    var directive = {
      restrict: 'EA',
      transclude: true,
      replace: true,
      templateUrl: 'components/actionsheet/actionsheet-button.html',
      require: '^zfActionSheet',
      scope: {
        title: '@?'
      },
      link: link
    }

    return directive;

    function link(scope, element, attrs, controller) {

      element.on('click', function(e) {
        controller.toggle();
        e.preventDefault();
      });

    }
  }

})();
