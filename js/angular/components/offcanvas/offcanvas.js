(function() {
  'use strict';

  angular.module('foundation.offcanvas', ['foundation.core'])
    .directive('zfOffcanvas', zfOffcanvas)
    .service('FoundationOffcanvas', FoundationOffcanvas)
  ;

  FoundationOffcanvas.$inject = ['FoundationApi'];

  function FoundationOffcanvas(foundationApi) {
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

    function toggle(target) {
      foundationApi.publish(target, 'toggle');
    }
  }

  zfOffcanvas.$inject = ['FoundationApi'];

  function zfOffcanvas(foundationApi) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/offcanvas/offcanvas.html',
      transclude: true,
      scope: {
        position: '@'
      },
      replace: true,
      compile: compile
    };

    return directive;

    function compile(tElement, tAttrs, transclude) {
      var type = 'offcanvas';

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs, controller) {
        iAttrs.$set('zf-closable', type);
        document.body.classList.add('has-off-canvas');
      }

      function postLink(scope, element, attrs) {
        scope.position = scope.position || 'left';

        scope.active = false;
        //setup
        foundationApi.subscribe(attrs.id, function(msg) {
          if(msg === 'show' || msg === 'open') {
            scope.show();
          } else if (msg === 'close' || msg === 'hide') {
            scope.hide();
          } else if (msg === 'toggle') {
            scope.toggle();
          }

          if (!scope.$root.$$phase) {
            scope.$apply();
          }

          return;
        });

        scope.hide = function() {
          scope.active = false;
          adviseActiveChanged();
          return;
        };

        scope.show = function() {
          scope.active = true;
          adviseActiveChanged();
          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
          adviseActiveChanged();
          return;
        };

        function adviseActiveChanged() {
          if (!angular.isUndefined(attrs.zfAdvise)) {
            foundationApi.publish(attrs.id, scope.active ? 'activated' : 'deactivated');
          }
        }
      }
    }
  }

})();
