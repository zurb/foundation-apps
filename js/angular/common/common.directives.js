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
  .directive('faAnimationIn', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    priority: 100, //set priority to override other directives
    link: function(scope, element, attrs) {
      var animation = attrs.faAnimationIn;
      var active = 'is-active';

      //subscribe
      foundationApi.subbscribe(attrs.id, function(msg) {
        //stop animation
        element[0].style.transitionDuration = 0;

        element.addClass(animation);

        //force a "tick"
        scope.$apply();

        //activate
        element[0].style.transitionDuration = '';
        element.addClass(active);


        element.one(events.join(' '), function() {
          //cleanup
          element.removeClass(animation);
        });

      });
    }
  };
}]);

angular.module('foundation.common.directives')
  .directive('faAnimationIn', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    priority: 100, //set priority to override other directives
    link: function(scope, element, attrs) {
      //animation logic
    }
  };
}]);
