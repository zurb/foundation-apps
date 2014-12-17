(function() {
  'use strict';

  angular.module('foundation.dynamicRouting.animations', ['ngAnimate', 'foundation.dynamicRouting'])
    .directive('uiView', uiView)
  ;

  function uiView($rootScope, $state) {
    return {
      restrict : 'ECA',
      priority : -400,
      link     : function (scope, element) {
        var animation = {};

        var cleanup = [
          $rootScope.$on('$stateChangeStart', onStateChangeStart),
          $rootScope.$on('$stateChangeError', onStateChangeError),
          scope.$on('$stateChangeSuccess', onStateChangeSuccess),
          scope.$on('$viewContentAnimationEnded', onViewContentAnimationEnded)
        ];

        var destroyed = scope.$on('$destroy', function () {
          angular.forEach(cleanup, function (cb) {
            if (angular.isFunction(cb)) {
              cb();
            }
          });

          destroyed();
        });

        function onStateChangeStart() {
          if ($state.includes(getState()) && animation.leave) {
            element.addClass(animation.leave);
          }
        }

        function onStateChangeError() {
          if (animation.leave ) {
            element.removeClass(animation.leave);
          }
        }

        function onStateChangeSuccess() {
          if ($state.includes(getState()) && animation.enter) {
            element.addClass( animation.enter );
          }
        }

        function onViewContentAnimationEnded( ev ) {
          if (ev.targetScope.$id === scope.$id && animation.enter) {
            element.removeClass(animation.enter);
          }
        }

        function getState() {
          var view  = element.data('$uiView');
          var state = view && view.state && view.state.self;

          if (state) {
            angular.extend(animation, state.animation);
          }

          return state;
        }
      }
    };
  }

  uiView.$inject = ['$rootScope', '$state'];

})();
