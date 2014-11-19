angular.module('foundation.common.directives', []);

angular.module('foundation.common.directives')
  .directive('faClose', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var parentElement= false;
      var tempElement = element.parent();

      //find parent modal
      while(parentElement == false) {
        if(tempElement[0].nodeName == 'BODY') {
          parentElement = '';
        }

        if(typeof tempElement.attr('fa-closable') !== 'undefined' && tempElement.attr('fa-closable') !== false) {
          parentElement = tempElement;
        }

        tempElement = tempElement.parent();
      }

      element.on('click', function(e) {
        foundationApi.publish(parentElement.attr('id'), 'close');
        e.preventDefault();
      });
    }
  }
}]);

angular.module('foundation.common.directives')
  .directive('faOpen', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.faOpen, 'open');
        e.preventDefault();
      });
    }
  }
}]);

angular.module('foundation.common.directives')
  .directive('faToggle', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.faToggle, 'toggle');
        e.preventDefault();
      });
    }
  }
}]);

angular.module('foundation.common.directives')
  .directive('faAnimate', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    priority: 100, //set priority to override other directives
    scope: {
      animationIn: '@?',
      animationOut: '@?'
    },
    link: function(scope, element, attrs) {
      var isActive = false;

      var activeClass = 'is-active';

      var reflow = function() {
        return element[0].style.offsetWidth;
      }

      var reset = function() {
        element[0].style.transitionDuration = 0;
        element.removeClass(activeClass + ' ' + scope.animationIn + ' ' + scope.animationOut);
      }

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
      }

      //subscribe
      foundationApi.subbscribe(attrs.id, function(msg) {
        if(msg === 'show' || msg === 'open') {
          animate(animationIn, true);
        } else if (msg === 'hide' || msg === 'close') {
          animate(animationOut, false);
        } else if (msg === 'toggle') {
          var newState = !isActive;
          var newAnimation = newState ? animationIn : animationOut;

          animate(newAnimation, newState);
        }

      });
    }
  };

}]);
