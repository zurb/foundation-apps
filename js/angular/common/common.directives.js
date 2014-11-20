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
