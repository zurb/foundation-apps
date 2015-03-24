(function() {
  'use strict';

  angular.module('foundation.common', ['foundation.core'])
    .directive('zfClose', zfClose)
    .directive('zfOpen', zfOpen)
    .directive('zfToggle', zfToggle)
    .directive('zfEscClose', zfEscClose)
    .directive('zfSwipeClose', zfSwipeClose)
    .directive('zfSwipeLeft', zfSwipeDirection('left'))
    .directive('zfSwipeRight', zfSwipeDirection('right'))
    .directive('zfSwipeUp', zfSwipeDirection('up'))
    .directive('zfSwipeDown', zfSwipeDirection('down'))
    .directive('zfHardToggle', zfHardToggle)
  ;

  zfClose.$inject = ['FoundationApi'];

  function zfClose(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var targetId = '';
      if (attrs.zfClose) {
        targetId = attrs.zfClose;
      } else {
        var parentElement= false;
        var tempElement = element.parent();
        //find parent modal
        while(parentElement === false) {
          if(tempElement[0].nodeName == 'BODY') {
            parentElement = '';
          }

          if(typeof tempElement.attr('zf-closable') !== 'undefined' && tempElement.attr('zf-closable') !== false) {
            parentElement = tempElement;
          }

          tempElement = tempElement.parent();
        }
        targetId = parentElement.attr('id');
      }

      element.on('click', function(e) {
        foundationApi.publish(targetId, 'close');
        e.preventDefault();
      });
    }
  }

  zfOpen.$inject = ['FoundationApi'];

  function zfOpen(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfOpen, 'open');
        e.preventDefault();
      });
    }
  }

  zfToggle.$inject = ['FoundationApi'];

  function zfToggle(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    }

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfToggle, 'toggle');
        e.preventDefault();
      });
    }
  }

  zfEscClose.$inject = ['FoundationApi'];

  function zfEscClose(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('keyup', function(e) {
        if (e.keyCode === 27) {
          foundationApi.closeActiveElements();
        }
        e.preventDefault();
      });
    }
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
          threshold: 5, // this is how far the swipe has to travel
          velocity: 0.5 // and this is how fast the swipe must travel
        });
      }
      // detect what direction the directive is pointing
      switch (attrs.zfSwipeClose) {
        case 'right':
          swipeDirection = 'swiperight';
          break;
        case 'left':
          swipeDirection = 'swipeleft';
          break;
        case 'up':
          swipeDirection = 'swipeup';
          break;
        case 'down':
          swipeDirection = 'swipedown';
          break;
        default:
          swipeDirection = 'swipe';
      }
      hammerElem.on(swipeDirection, function() {
        foundationApi.publish(attrs.id, 'close');
      });
    }
  }

  function zfSwipeDirection(direction) {
    return ['$parse', 'FoundationApi', function zfSwipeImpl($parse, foundationApi) {
      var directive = {
        restrict: 'A',
        compile: compile
      };
      return directive;

      function compile($element, attrs) {
        var swipeDirection;
        var swipeDirective;
        var fn;

        switch (direction) {
          case 'right':
            swipeDirection = 'swiperight';
            swipeDirective = 'zfSwipeRight';
            break;
          case 'left':
            swipeDirection = 'swipeleft';
            swipeDirective = 'zfSwipeLeft';
            break;
          case 'up':
            swipeDirection = 'swipeup';
            swipeDirective = 'zfSwipeUp';
            break;
          case 'down':
            swipeDirection = 'swipedown';
            swipeDirective = 'zfSwipeDown';
            break;
          default:
            swipeDirection = 'swipe';
            swipeDirective = 'zfSwipe';
        }

        fn = $parse(attrs[swipeDirective], /* interceptorFn */ null, /* expensiveChecks */ true);

        return function zfSwipeDirective(scope, element) {
          var hammerElem;
          if (Hammer) {
            hammerElem = new Hammer(element[0]);
            // set the options for swipe (to make them a bit more forgiving in detection)
            hammerElem.get('swipe').set({
              direction: Hammer.DIRECTION_ALL,
              threshold: 5, // this is how far the swipe has to travel
              velocity: 0.5 // and this is how fast the swipe must travel
            });

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
    }];
  }

  zfHardToggle.$inject = ['FoundationApi'];

  function zfHardToggle(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.closeActiveElements({exclude: attrs.zfHardToggle});
        foundationApi.publish(attrs.zfHardToggle, 'toggle');
        e.preventDefault();
      });
    }
  }

})();
