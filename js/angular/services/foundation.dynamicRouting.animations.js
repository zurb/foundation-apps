(function() {
  'use strict';

  angular.module('foundation.dynamicRouting.animations', ['ngAnimate', 'foundation.dynamicRouting'])
    .animation('.ui-animation', uiAnimation)
  ;

  uiAnimation.$inject = ['$rootScope', '$state'];

  function uiAnimation($rootScope, $state) {
    var events = ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend',
                  'webkitTransitionEnd', 'otransitionend', 'transitionend'];

    var parentStyle = 'position-absolute';

    var animation = {};

    animation.enter = enterAnimation;
    animation.leave = leaveAnimation;

    return animation;

    function enterAnimation(element, done) {
      var scope = element.scope();

      if(scope.vars && scope.vars.animationIn) {
        var animationIn  = scope.vars.animationIn;
        var animationOut = scope.vars.animationOut || '';
        var initial  = 'ng-enter';
        var activate = 'ng-enter-active';
        var timedOut = true;

        //reset possible failed animations and bugs
        element.parent().addClass(parentStyle);
        element.removeClass(activate + ' ' + initial + ' ' + animationIn + ' ' + animationOut);
        element[0].style.transitionDuration = 0;

        //start animation
        element.addClass(animationIn);
        element.addClass(initial);

        $rootScope.$digest();

        element[0].style.transitionDuration = '';
        element.addClass(activate);

        var finishAnimation = function() {
          element.parent().removeClass(parentStyle);
          element.removeClass(activate + ' ' + initial + ' ' + animationIn + ' ' + animationOut);
          timedOut = false;
          done();
        }

        element.one(events.join(' '), function() {
          finishAnimation();
        });

        setTimeout(function() {
          if (timedOut) {
            finishAnimation();
          }
        }, 3000);

      } else {
        done();
      }

      return function(isCancelled) {

      };
    }

    function leaveAnimation(element, done) {
      var scope = element.scope();

      if(scope.vars && scope.vars.animationOut) {
        var animationIn  = scope.vars.animationIn || '';
        var animationOut = scope.vars.animationOut;
        var initial  = 'ng-leave';
        var activate = 'ng-leave-active';
        var timedOut = true;

        element.removeClass(activate + ' ' + initial + ' ' + animationIn + ' ' + animationOut);
        element[0].style.transitionDuration = 0;

        //start animation
        element.addClass(animationOut);
        element.addClass(initial);

        $rootScope.$digest();

        element[0].style.transitionDuration = '';
        element.addClass(activate);

        var finishAnimation = function() {
          element.parent().removeClass(parentStyle);
          element.removeClass(activate + ' ' + initial + ' ' + animationIn + ' ' + animationOut);
          timedOut = false;
          done();
        }

        element.one(events.join(' '), function() {
          finishAnimation();
        });

        setTimeout(function() {
          if (timedOut) {
            finishAnimation();
          }
        }, 3000);

      } else {
        done();
      }

      return function(isCancelled) {

      };
    }
  }

})();
