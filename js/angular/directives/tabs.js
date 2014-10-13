angular.module('foundation.tabs', []);

angular.module('foundation.tabs')
  .directive('faTabContent', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    template: '<div ng-transclude></div>',
    transclude: 'true',
    replace: true,
    compile: function(tElement, tAttr) {
      //set ID
      tElement.addClass('tab-content');

      return {
        pre: function preLink(scope, element, attrs) {
        },
        post: function postLink(scope, element, attrs) {
        }
      };
    }
  };
}]);

angular.module('foundation.tabs')
  .directive('faTab', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller, transclude) {
      var currentState = '';
      var id = attrs.id;

      scope.hide = function() {
        element.removeClass('is-active');
        currentState = 'hide';
        return;
      };

      scope.show = function() {
        element.parent().children().removeClass('is-active');
        element.addClass('is-active');
        currentState = 'show';
        //inform others to close

        return;
      };

      element.on('click', function(e) {
        foundationApi.publish(attrs.faHref, attrs.faHref);
        e.preventDefault();
      });

      foundationApi.subscribe(attrs.id + '-tab', function(msg) {
        if(msg == 'show' || msg == 'open') {
          scope.show();
        } else if (msg == 'close' || msg == 'hide') {
          scope.hide();
        }

        return;
      });

      //init
      var init = function() {
        var siblingsEl = element.parent().children();
        var firstEl = angular.element(siblingsEl[0]);

        if(!firstEl.hasClass('is-active')) {
          firstEl.addClass('is-active');
          foundationApi.publish(attrs.id + '-control', 'show');
        }

      };

      init();
    }
  };
}]);

angular.module('foundation.tabs')
  .directive('faTabHref', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller, transclude) {
      var currentState = '';

      scope.hide = function() {
        element.removeClass('is-active');
        currentState = 'hide';
        return;
      };

      scope.show = function() {
        element.parent().children().removeClass('is-active');
        element.addClass('is-active');
        currentState = 'show';
        return;
      };

      element.on('click', function(e) {
        foundationApi.publish(attrs.faTabHref + '-tab', 'show');
        scope.show();
        e.preventDefault();
      });

      foundationApi.subscribe(attrs.faHref + '-control', function(msg) {
        if(msg == 'show' || msg == 'open') {
          scope.show();
        } else if (msg == 'close' || msg == 'hide') {
          scope.hide();
        }

        return;
      });

      //init
      var init = function() {
        var siblingsEl = element.parent().children();
        var firstEl = angular.element(siblingsEl[0]);
        if(!firstEl.hasClass('is-active')) {
          firstEl.triggerHandler('click');
        }
      };

      init();
    }
  };
}]);
