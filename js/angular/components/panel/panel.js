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
      var animate = tAttrs.hasOwnProperty('zfAdvise') ? foundationApi.animateAndAdvise : foundationApi.animate;

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
        var setAnim = {
          left: function(){
            animationIn  = attrs.animationIn || 'slideInRight';
            animationOut = attrs.animationOut || 'slideOutLeft';
          },
          right: function(){
            animationIn  = attrs.animationIn || 'slideInLeft';
            animationOut = attrs.animationOut || 'slideOutRight';
          },
          top: function(){
            animationIn  = attrs.animationIn || 'slideInDown';
            animationOut = attrs.animationOut || 'slideOutUp';
          },
          bottom: function(){
            animationIn  = attrs.animationIn || 'slideInUp';
            animationOut = attrs.animationOut || 'slideOutDown';
          }
        };
        setAnim[scope.position]();
        //urgh, there must be a better way, ***there totally is btw***
        // if(scope.position === 'left') {
        //   animationIn  = attrs.animationIn || 'slideInRight';
        //   animationOut = attrs.animationOut || 'slideOutLeft';
        // } else if (scope.position === 'right') {
        //   animationIn  = attrs.animationIn || 'slideInLeft';
        //   animationOut = attrs.animationOut || 'slideOutRight';
        // } else if (scope.position === 'top') {
        //   animationIn  = attrs.animationIn || 'slideInDown';
        //   animationOut = attrs.animationOut || 'slideOutUp';
        // } else if (scope.position === 'bottom') {
        //   animationIn  = attrs.animationIn || 'slideInUp';
        //   animationOut = attrs.animationOut || 'slideOutDown';
        // }


        //setup
        foundationApi.subscribe(attrs.id, function(msg) {
          var panelPosition = $window.getComputedStyle(element[0]).getPropertyValue("position");

          // patch to prevent panel animation on larger screen devices
          // don't run animation on grid elements, only panel
          if (panelPosition == 'static' || panelPosition == 'relative') {
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

        // function finish(el)

        scope.hide = function() {
          if(scope.active){
            scope.active = false;
            animate(element, scope.active, animationIn, animationOut);
          }

          return;
        };

        scope.show = function() {
          if(!scope.active){
            scope.active = true;
            animate(element, scope.active, animationIn, animationOut);
          }

          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
          animate(element, scope.active, animationIn, animationOut);

          return;
        };

        element.on('click', function(e) {
          // Check sizing
          var srcEl = e.target;

          if (!matchMedia(globalQueries.medium).matches && srcEl.href && srcEl.href.length > 0) {
            // Hide element if it can't match at least medium
            scope.hide();
            animate(element, scope.active, animationIn, animationOut);
          }
        });
      }
    }
  }

})();
