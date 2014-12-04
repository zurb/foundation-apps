angular.module('foundation.common.directives', []);

angular.module('foundation.common.directives')
  .directive('zfClose', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
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

      element.on('click', function(e) {
        foundationApi.publish(parentElement.attr('id'), 'close');
        e.preventDefault();
      });
    }
  };
}]);

angular.module('foundation.common.directives')
  .directive('zfOpen', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfOpen, 'open');
        e.preventDefault();
      });
    }
  };
}]);

angular.module('foundation.common.directives')
  .directive('zfToggle', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfToggle, 'toggle');
        e.preventDefault();
      });
    }
  }
}]);

angular.module('foundation.common.directives')
  .directive('zfHardToggle', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        var activeElements = document.querySelectorAll('.is-active[zf-closable]');
        if (activeElements.length) {
          angular.forEach(activeElements, function(el) {
            foundationApi.publish(el.id, 'close');
          });
        }
        foundationApi.publish(attrs.zfHardToggle, 'toggle');
        e.preventDefault();
      });
    }
  }
}]);

angular.module('foundation.common.directives')
  .directive('zfAnimate', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    priority: 100, //set priority to override other directives
    link: function(scope, element, attrs) {
      var isActive = false;
      var animationIn = attrs.animationIn;
      var animationOut = attrs.animationOut;

      var activeClass = 'is-active';

      var reflow = function() {
        return element[0].offsetWidth;
      };

      var reset = function() {
        element[0].style.transitionDuration = 0;
        element.removeClass(activeClass + ' ' + animationIn + ' ' + animationOut);
      };

      var animate = function(animationClass, activation) {
        //stop animation
        reset();
        element.addClass(animationClass);

        //force a "tick"
        reflow();

        //activate
        element[0].style.transitionDuration = '';
        element.addClass(activeClass);
        isActive = activation;
      };

      //subscribe
      foundationApi.subscribe(attrs.id, function(msg) {
        if(msg === 'show' || msg === 'open') {
          animate(animationIn, true);
        } else if (msg === 'hide' || msg === 'close') {
          animate(animationOut, false);
        } else if (msg === 'toggle') {
          var newState = !isActive;
          var newAnimation = newState ? animationIn : animationOut;

          //allow other elements to do their job
          setTimeout(function() {
            animate(newAnimation, newState);
          }, 1);
        }

      });
    }
  };

}]);
