(function() {
  'use strict';

  angular.module('foundation.dynamicRouting.animations', ['foundation.dynamicRouting'])
    .directive('uiView', uiView)
  ;

  function uiView($rootScope, $state) {
    return {
      restrict : 'ECA',
      priority : -400,
      link     : function link(scope, element) {
        var animation = {};

        var cleanup = [
          $rootScope.$on('$stateChangeStart', onStateChangeStart),
          $rootScope.$on('$stateChangeError', onStateChangeError),
          scope.$on('$stateChangeSuccess', onStateChangeSuccess),
          scope.$on('$viewContentAnimationEnded', onViewContentAnimationEnded)
        ];

        var destroyed = scope.$on('$destroy', function onDestroy() {
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

            var parentHeight = parseInt(element.parent()[0].style.height);
            var elHeight = parseInt(window.getComputedStyle(element[0], null).getPropertyValue('height'));

            var tempHeight = parentHeight > 0 ? parentHeight : elHeight > 0 ? elHeight : '';

            element.parent()[0].style.height = tempHeight + 'px';
            element.parent().addClass('position-absolute');
          }
        }

        function onStateChangeError() {
          if (animation.leave) {
            element.removeClass(animation.leave);
            element.parent().removeClass('position-absolute');
            element.parent()[0].style.height = '';
          }
        }

        function onStateChangeSuccess() {
          if ($state.includes(getState()) && animation.enter) {
            element.addClass(animation.enter);
            element.parent().removeClass('position-absolute');
            element.parent()[0].height = '';
          }

        }

        function onViewContentAnimationEnded(ev) {
          if (ev.targetScope === scope && animation.enter) {
            element.removeClass(animation.enter);
            element.parent().removeClass('position-absolute');
            element.parent()[0].height = '';
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
