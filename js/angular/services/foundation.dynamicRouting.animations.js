(function() {
  'use strict';

  angular.module('foundation.dynamicRouting.animations', ['foundation.dynamicRouting'])
    .directive('uiView', uiView)
  ;

  uiView.$inject = ['$rootScope', '$state'];

  function uiView($rootScope, $state) {
    var directive = {
      restrict : 'ECA',
      priority : -400,
      link     : link
    };

    return directive;

    function link(scope, element) {
      var animation = {};
      var initiator = false;
      var presetHeight;

      var cleanup = [
        $rootScope.$on('$stateChangeStart', onStateChangeStart),
        $rootScope.$on('$stateChangeError', onStateChangeError),
        scope.$on('$stateChangeSuccess', onStateChangeSuccess),
        scope.$on('$viewContentAnimationEnded', onViewContentAnimationEnded),
      ];

      var destroyed = scope.$on('$destroy', function onDestroy() {
        angular.forEach(cleanup, function (cb) {
          if (angular.isFunction(cb)) {
            cb();
          }
        });

        destroyed();
      });

      function registerState(state) {
        if ($rootScope.registeredStates.indexOf(state) === -1) {
          $rootScope.registeredStates.push(state);
        }
      }

      function onStateChangeStart(event, toState, toParams, fromState, fromParams) {
        if ($state.includes(getState()) && animation.leave) {
          element.addClass(animation.leave);
        }

        animationRouter(event, toState, fromState);

        prepareParent();
      }

      function animationRouter(event, toState, fromState) {
        if (fromState.animation) {
          if (fromState.animation.leave && !toState.animation) {
            // if there is already a state existing on the page
            if (element.parent().children().length > 1) {
              resetParent();

              element.removeClass(fromState.animation.leave);
            }
          }
          else {

            element.remove();
            resetParent();
          }
        }
      }

      function onStateChangeError() {
        if(animation.leave) {
          element.removeClass(animation.leave);
        }

        resetParent(); //reset parent if state change fails
      }

      function onStateChangeSuccess() {
        if ($state.includes(getState()) && animation.enter) {
          element.addClass(animation.enter);
        }
      }

      function onViewContentAnimationEnded(event) {
        if (event.targetScope === scope && animation.enter) {
          element.removeClass(animation.enter);
        }
        resetParent(); //reset parent if state change when animation is done
      }

      function getState() {
        var view  = element.data('$uiView');
        var state = view && view.state && view.state.self;

        if (state) {
          angular.extend(animation, state.animation);
        }

        return state;
      }

      function resetElement() {
        element.removeClass()
      }

      function resetParent() {
        element.parent().removeClass('position-absolute');
        if(presetHeight !== true) {
          element.parent()[0].style.height = null;
        }
      }

      function prepareParent() {
        var parentHeight = parseInt(element.parent()[0].style.height);
        var elHeight = parseInt(window.getComputedStyle(element[0], null).getPropertyValue('height'));
        var tempHeight = parentHeight > 0 ? parentHeight : elHeight > 0 ? elHeight : '';

        if(parentHeight > 0) {
          presetHeight = true;
        }

        element.parent()[0].style.height = tempHeight + 'px';
        element.parent().addClass('position-absolute');
      }
    }
  }

})();
