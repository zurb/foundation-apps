(function() {
  'use strict';

  angular.module('foundation.panel', ['foundation.core'])
    .directive('zfPanel', zfPanel)
    .service('FoundationPanel', FoundationPanel)
  ;

  FoundationPanel.$inject = ['FoundationApi'];

  function FoundationPanel(foundationApi) {
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

  zfPanel.$inject = ['FoundationApi', '$window'];

  function zfPanel(foundationApi, $window) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/panel/panel.html',
      transclude: true,
      scope: {
        position: '@?'
      },
      replace: true,
      compile: compile
    };

    return directive;

    function compile(tElement, tAttrs, transclude) {
      var type = 'panel';

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs, controller) {
        iAttrs.$set('zf-closable', type);
        scope.position = scope.position || 'left';
        scope.positionClass = 'panel-' + scope.position;
      }

      function postLink(scope, element, attrs) {
        scope.active = false;
        var animationIn, animationOut;
        var globalQueries = foundationApi.getSettings().mediaQueries;

        //urgh, there must be a better way
        if(scope.position === 'left') {
          animationIn  = attrs.animationIn || 'slideInRight';
          animationOut = attrs.animationOut || 'slideOutLeft';
        } else if (scope.position === 'right') {
          animationIn  = attrs.animationIn || 'slideInLeft';
          animationOut = attrs.animationOut || 'slideOutRight';
        } else if (scope.position === 'top') {
          animationIn  = attrs.animationIn || 'slideInDown';
          animationOut = attrs.animationOut || 'slideOutUp';
        } else if (scope.position === 'bottom') {
          animationIn  = attrs.animationIn || 'slideInUp';
          animationOut = attrs.animationOut || 'slideOutBottom';
        }


        //setup
        foundationApi.subscribe(attrs.id, function(msg) {
          var panelPosition = $window.getComputedStyle(element[0]).getPropertyValue("position");

          // patch to prevent panel animation on larger screen devices
          if (panelPosition !== 'absolute') {
            return;
          }

          if(msg == 'show' || msg == 'open') {
            scope.show();
          } else if (msg == 'close' || msg == 'hide') {
            scope.hide();
          } else if (msg == 'toggle') {
            scope.toggle();
          }
          
          if (!scope.$root.$$phase) {
            scope.$apply();
          }

          return;
        });

        scope.hide = function() {
          if(scope.active){
            scope.active = false;
            foundationApi.animate(element, scope.active, animationIn, animationOut);
          }

          return;
        };

        scope.show = function() {
          if(!scope.active){
            scope.active = true;
            foundationApi.animate(element, scope.active, animationIn, animationOut);
          }

          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
          foundationApi.animate(element, scope.active, animationIn, animationOut);
          
          return;
        };

        element.on('click', function(e) {
          //check sizing
          var srcEl = e.srcElement;

          if(!matchMedia(globalQueries.medium).matches && srcEl.href && srcEl.href.length > 0) {
            //hide element if it can't match at least medium
            scope.hide();
            foundationApi.animate(element, scope.active, animationIn, animationOut);
          }
        });
      }
    }
  }

})();
