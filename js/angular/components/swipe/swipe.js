(function() {
  'use strict';

  angular.module('foundation.swipe', ['foundation.core'])
    .provider('SwipeSettings', SwipeSettings)
    .directive('zfSwipeClose', zfSwipeClose)
    .directive('zfSwipe', zfSwipe)
  ;

  function SwipeSettings() {
    var distances = {
      short: 5,
      normal: 10,
      far: 15
    };
    var velocities = {
      slow: 0.5,
      normal: 0.65,
      fast: 0.8
    };

    this.clearDistances = function (key, distances) {
      distances = {};
    };

    this.clearVelocities = function (key, velocities) {
      velocities = {};
    };

    this.addDistance = function (key, distance) {
      distances[key] = distance;
    };

    this.addVelocity = function (key, velocity) {
      velocities[key] = velocity;
    };

    this.$get = function () {
      return {
        getDistance: getDistance,
        getVelocity: getVelocity
      };

      function getDistance(key) {
        return distances[key] || 0;
      }

      function getVelocity(key) {
        return velocities[key] || 0;
      }
    };
  }

  zfSwipeClose.$inject = ['FoundationApi'];

  function zfSwipeClose(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;

    function link($scope, element, attrs) {
      var swipeDirection;
      var hammerElem;
      if (Hammer) {
        hammerElem = new Hammer(element[0]);
        // set the options for swipe (to make them a bit more forgiving in detection)
        hammerElem.get('swipe').set({
          direction: Hammer.DIRECTION_ALL,
          threshold: 5,
          velocity: 0.5
        });
      }
      // detect what direction the directive is pointing
      swipeDirection = getHammerSwipeDirection(attrs.zfSwipeClose);

      hammerElem.on(swipeDirection, function() {
        foundationApi.publish(attrs.id, 'close');
      });
    }
  }

  zfSwipe.$inject = ['$parse', 'SwipeSettings'];

  function zfSwipe($parse, SwipeSettings) {
    var directive = {
      restrict: 'A',
      compile: compile
    };
    return directive;

    function compile(element, attrs) {
      var fn, swipeDirection, swipeDistance, swipeVelocity;

      // configure function to evalute expression upon swipe (see ng-click source)
      fn = $parse(attrs.zfSwipe, /* interceptorFn */ null, /* expensiveChecks */ true);

      // pull values from attributes
      swipeDirection = attrs.direction || attrs.dataDirection;
      swipeDistance = attrs.distance || attrs.dataDistance;
      swipeVelocity = attrs.velocity || attrs.dataVelocity;

      // update values to those required by hammer config
      swipeDirection = getHammerSwipeDirection(swipeDirection);
      if (angular.isString(swipeDistance)) {
        // get value for named distance
        swipeDistance = SwipeSettings.getDistance(swipeDistance);
      } else if (!angular.isNumber(swipeDistance)) {
        // clear value if not number
        swipeDistance = undefined;
      }
      if (angular.isString(swipeVelocity)) {
        // get value for named velocity
        swipeVelocity = SwipeSettings.getVelocity(swipeVelocity);
      } else if (!angular.isNumber(swipeVelocity)) {
        // clear value if not number
        swipeVelocity = undefined;
      }

      return function zfSwipeDirective(scope, element) {
        var hammerElem, hammerConfig;
        if (Hammer) {
          // configure hammer
          hammerConfig = {
            direction: Hammer.DIRECTION_ALL
          };
          if (swipeDistance) {
            hammerConfig.threshold = swipeDistance;
          }
          if (swipeVelocity) {
            hammerConfig.velocity = swipeVelocity;
          }

          hammerElem = new Hammer(element[0]);
          hammerElem.get('swipe').set(hammerConfig);

          hammerElem.on(swipeDirection, function(event) {
            // evalute expression provided for attribute
            var callback = function() {
              fn(scope, {$event:event});
            };
            scope.$apply(callback);
          });
        }
      };
    }
  }

  function getHammerSwipeDirection(dir) {
    switch (dir) {
      case 'right':
        return 'swiperight';
      case 'left':
        return 'swipeleft';
      case 'up':
        return 'swipeup';
      case 'down':
        return 'swipedown';
      default:
        return 'swipe';
    }
  }

})();
