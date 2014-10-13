angular.module('foundation.tabs', []);

angular.module('foundation.tabs')
  .directive('faTabContent', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    template: '<div ng-transclude></div>',
    transclude: 'true',
    compile: function(tElement, tAttr) {
      //set ID
      if(!tAttr['id']) {
        var uuid = foundationApi.generateUuid();
        tAttr.$set('id', uuid);
      }

      return {
        post: function postLink(scope, element, attrs) {

        }
      }
    }
  };
}]);

angular.module('foundation.tabs')
  .directive('faTab', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller, transclude) {
      var currentState = '';
      var id = attrs['id'];

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

      foundationApi.subscribe(attrs[id] + '-tab', function(msg) {
        if(msg == 'show' || msg == 'open') {
          scope.show();
        } else if (msg == 'close' || msg == 'hide') {
          scope.hide();
        }

        return;
      });
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
        foundationApi.publish(attrs.faHref + '-tab', 'show');
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
    }
  };
}]);
