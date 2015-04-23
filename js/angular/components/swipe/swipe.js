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

  zfSwipeClose.$inject = ['$parse', 'SwipeSettings'];

  function zfSwipe($parse, SwipeSettings) {
    var directive = {
      restrict: 'A',
      compile: compile
    };
    return directive;

    function compile(element, attrs) {
      var swipeDirection = attrs['direction'] || attrs['dataDirection'];
      var swipeDistance = attrs['distance'] || attrs['dataDistance'];
      var swipeVelocity = attrs['velocity'] || attrs['dataVelocity'];
      var fn = $parse(attrs['zfSwipe'], /* interceptorFn */ null, /* expensiveChecks */ true);

      swipeDirection = getHammerSwipeDirection(swipeDirection);
      if (swipeDistance) {
        swipeDistance = SwipeSettings.getDistance(swipeDistance);
      }
      if (swipeVelocity) {
        swipeVelocity = SwipeSettings.getVelocity(swipeVelocity);
      }

      return function zfSwipeDirective(scope, element) {
        var hammerElem, hammerConfig;
        if (Hammer) {
          hammerElem = new Hammer(element[0]);
          hammerConfig = {};
          if (swipeDistance) {
            hammerConfig.threshold = swipeDistance;
          }
          if (swipeVelocity) {
            hammerConfig.velocity = swipeVelocity;
          }
          hammerConfig.direction = Hammer.DIRECTION_ALL;
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
