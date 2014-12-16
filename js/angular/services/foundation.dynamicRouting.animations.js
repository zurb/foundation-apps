(function() {
  'use strict';

  angular.module('foundation.dynamicRouting.animations', ['ngAnimate', 'foundation.dynamicRouting'])
    .animation('.ui-animation', uiAnimation)
  ;

  uiAnimation.$inject = ['$animate'];

  function uiAnimation($animate) {
    var parentStyle = 'position-absolute';

    return {
      enter : enterAnimation,
      leave : leaveAnimation
    };

    function enterAnimation(element, done) {
      var scope      = element.scope();
      var enterClass = scope.$eval('vars.animationIn');

      if (! enterClass || element.hasClass(enterClass)) {
        done();
        return angular.noop;
      }

      element.parent().addClass(parentStyle);

      var animation = $animate.addClass(element, enterClass);

      animation
        .then(function() {
          element.parent().removeClass(parentStyle);
          done();
        });

      return function () {
        $animate.cancel(animation);
      };
    }

    function leaveAnimation(element, done) {
      var scope      = element.scope();
      var leaveClass = scope.$eval('vars.animationOut');

      if (! leaveClass || element.hasClass(leaveClass)) {
        done();
        return angular.noop;
      }

      element.parent().addClass(parentStyle);

      var animation = $animate.addClass(element, leaveClass)
        .then(function() {
          element.parent().removeClass(parentStyle);
          done();
        });

      return function () {
        $animate.cancel(animation);
      };
    }
  }

})();
