angular.module('foundation.common.animations', ['ngAnimate']);

angular.module('foundation.common.animations')
  .animation('.ui-animation', ['$state', function($state) {
    var events = ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend',
                  'webkitTransitionEnd', 'otransitionend', 'transitionend'];
    return {
      enter: function(element, done) {
        var scope = element.scope();

        if(scope.vars && scope.vars.animationIn) {
          animationIn = scope.vars.animationIn;
          animationOut = scope.vars.animationOut || '';

          //reset possible failed animations and bugs
          element.removeClass(animationIn + ' ' + animationOut);

          element.addClass(animationIn);
          element.addClass('animated');

          element.one(events.join(' '), function(){
            //cleanup
            element.removeClass(animationIn + ' ' + animationOut);
            done();
          });
        } else {
          done();
        }

        return function(isCancelled) {

        }
      },
      leave: function(element, done) {
        var scope = element.scope();

        if(scope.vars && scope.vars.animationOut) {
          animationIn = scope.vars.animationIn || '';
          animationOut = scope.vars.animationOut;

          //reset possible failed animations and bugs
          element.removeClass(animationIn + ' ' + animationOut);

          element.addClass(animationOut);
          element.addClass('animated');

          element.one(events.join(' '), function(){
            //cleanup
            element.removeClass(animationIn + ' ' + animationOut);
            done();
          });
        } else {
          done();
        }

          return function(isCancelled) {

          }
       }
    }


  }]);
