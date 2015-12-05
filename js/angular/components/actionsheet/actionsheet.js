(function() {
  'use strict';

  angular.module('foundation.actionsheet', ['foundation.core'])
    .controller('ZfActionSheetController', zfActionSheetController)
    .directive('zfActionSheet', zfActionSheet)
    .directive('zfAsContent', zfAsContent)
    .directive('zfAsButton', zfAsButton)
    .service('FoundationActionSheet', FoundationActionSheet)
  ;

  FoundationActionSheet.$inject = ['FoundationApi'];

  function FoundationActionSheet(foundationApi) {
    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;

    return service;

    //target should be element ID
    function activate(target) {
      foundationApi.publish(target, 'show');
    }

    //target should be element ID
    function deactivate(target) {
      foundationApi.publish(target, 'hide');
    }
  }

  zfActionSheetController.$inject = ['$scope', 'FoundationApi'];

  function zfActionSheetController($scope, foundationApi) {
    var controller = this;
    var content = controller.content = $scope.content;
    var container = controller.container = $scope.container;
    var body = angular.element(document.body);

    controller.registerContent = function(scope) {
      content = scope;
      content.active = false;
    };

    controller.registerContainer = function(scope) {
      container = scope;
      container.active = false;
    };

    controller.toggle = toggle;
    controller.hide = hide;
    controller.show = show;

    controller.registerListener = function() {
      document.body.addEventListener('click', listenerLogic);
    };

    controller.deregisterListener = function() {
      document.body.removeEventListener('click', listenerLogic);
    }

    function listenerLogic(e) {
      var el = e.target;
      var insideActionSheet = false;

      do {
        if(el.classList && el.classList.contains('action-sheet-container')) {
          insideActionSheet = true;
          break;
        }

      } while ((el = el.parentNode));

      if(!insideActionSheet) {
        // if the element has a toggle attribute, do nothing
        if (e.target.attributes['zf-toggle'] || e.target.attributes['zf-hard-toggle']) {
          return;
        };
        // if the element is outside the action sheet and is NOT a toggle element, hide
        hide();
      }
    }

    function hide() {
      content.hide();
      container.hide();

      if (!$scope.$$phase) {
        content.$apply();
        container.$apply();
      }
    }

    function toggle() {
      content.toggle();
      container.toggle();

      if (!$scope.$$phase) {
        content.$apply();
        container.$apply();
      }
    }

    function show() {
      content.show();
      container.show();

      if (!$scope.$$phase) {
        content.$apply();
        container.$apply();
      }
    }
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

          if (msg === 'show' || msg === 'open') {
            controller.show();
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

        scope.show = function() {
          scope.active = true;
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
        if(scope.active) {
          controller.registerListener();
        } else {
          controller.deregisterListener();
        }

        return;
      };

      scope.hide = function() {
        scope.active = false;
        controller.deregisterListener();
        return;
      };

      scope.show = function() {
        scope.active = true;
        controller.registerListener();
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
