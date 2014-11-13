angular.module('foundation.common.animations', ['ngAnimate']);

angular.module('foundation.common.animations')
  .animation('.ui-animation', ['$state', '$rootScope', function($state, $rootScope) {
    var events = ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend',
                  'webkitTransitionEnd', 'otransitionend', 'transitionend'];
    var active = 'is-active';
    var parentStyle = 'position-absolute';

    return {
      enter: function(element, done) {
        var scope = element.scope();

        if(scope.vars && scope.vars.animationIn) {

          var animationIn = scope.vars.animationIn;
          var animationOut = scope.vars.animationOut || '';

          //reset possible failed animations and bugs
          element.parent().addClass(parentStyle);
          element.removeClass(active + ' ' + animationIn + ' ' + animationOut);
          element[0].style.transitionDuration = 0;

          //start animation
          console.log(element[0].style);
          element.addClass(animationIn);

          $rootScope.$digest();

          element[0].style.transitionDuration = '';
          element.addClass(active);

          element.one(events.join(' '), function() {
            //cleanup
            element.removeClass(active + ' ' + animationIn + ' ' + animationOut);
            element.parent().removeClass(parentStyle);
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

          element.removeClass(active + ' ' + animationIn + ' ' + animationOut);
          element[0].style.transitionDuration = 0;

          //start animation
          console.log(element[0].style);
          element.addClass(animationOut);

          $rootScope.$digest();

          element[0].style.transitionDuration = '';
          element.addClass(active);

          element.one(events.join(' '), function() {
            //cleanup
            element.removeClass(active + ' ' + animationIn + ' ' + animationOut);
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
