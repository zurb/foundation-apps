(function() {
  'use strict';

  angular.module('foundation.panel', ['foundation.core'])
    .directive('zfPanel', zfPanel)
  ;

  zfPanel.$inject = ['FoundationApi'];

  function zfPanel(foundationApi) {
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
          if(msg === 'show' || msg === 'open') {
            scope.show();
          } else if (msg === 'close' || msg === 'hide') {
            scope.hide();
          } else if (msg === 'toggle') {
            scope.toggle();
          }

          foundationApi.queueAnimation(element, function() {
            foundationApi.animate(element, scope.active, animationIn, animationOut);
            scope.$apply();
          });

          return;
        });

        scope.hide = function() {
          scope.active = false;
          return;
        };

        scope.show = function() {
          scope.active = true;
          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
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
