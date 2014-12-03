angular.module('foundation.common.animations', ['ngAnimate']);

angular.module('foundation.common.animations')
  .animation('.ui-animation', ['$state', '$rootScope', function($state, $rootScope) {
    var events = ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend',
                  'webkitTransitionEnd', 'otransitionend', 'transitionend'];

    var parentStyle = 'position-absolute';

    return {
      enter: function(element, done) {
        var scope = element.scope();
        if(scope.vars && scope.vars.animationIn) {

          var animationIn = scope.vars.animationIn;
          var animationOut = scope.vars.animationOut || '';
          var initial = 'ng-enter';
          var activate = 'ng-enter-active';

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

          element.one(events.join(' '), function() {
            //cleanup
            element.parent().removeClass(parentStyle);
            element.removeClass(activate + ' ' + initial + ' ' + animationIn + ' ' + animationOut);
            done();
          });
        } else {
          done();
        }

        return function(isCancelled) {

        };
      },
      leave: function(element, done) {
        var scope = element.scope();

        if(scope.vars && scope.vars.animationOut) {
          var animationIn = scope.vars.animationIn || '';
          var animationOut = scope.vars.animationOut;
          var initial = 'ng-leave';
          var activate = 'ng-leave-active';

          element.removeClass(activate + ' ' + initial + ' ' + animationIn + ' ' + animationOut);
          element[0].style.transitionDuration = 0;

          //start animation
          element.addClass(animationOut);
          element.addClass(initial);

          $rootScope.$digest();

          element[0].style.transitionDuration = '';
          element.addClass(activate);

          element.one(events.join(' '), function() {
            //cleanup
            element.removeClass(activate + ' ' + initial + ' ' + animationIn + ' ' + animationOut);
            element.parent().removeClass(parentStyle);
            done();
          });

        } else {
          done();
        }

        return function(isCancelled) {

        };
       }
    };
}]);
