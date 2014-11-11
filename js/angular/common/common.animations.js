angular.module('foundation.common.animations', ['ngAnimate']);

angular.module('foundation.common.animations')
  .animation('.ui-animation', ['$state', function($state) {
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

          element.addClass(animationIn);

          setTimeout(function() {
            element.addClass(active);
          }, 100);

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

          //reset possible failed animations and bugs
          element.parent().addClass(parentStyle);
          element.removeClass(active + ' ' + animationIn + ' ' + animationOut);
          element.addClass(animationOut);

          element.addClass(active);

          element.one(events.join(' '), function(){
            //cleanup
            element.removeClass(parentStyle + ' ' + active + ' ' + animationIn + ' ' + animationOut);
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
