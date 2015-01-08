(function() {
  'use strict';

  angular.module('foundation.iconic', [])
    .service('Iconic', iconic)
    .directive('zfIconic', zfIconic)
  ;

  //iconic wrapper
  function iconic() {
    var iconicObject = IconicJS();

    var service = {};

    service.getAccess = getAccess;

    return service;

    function getAccess() {
      return iconicObject;
    }
  }

  zfIconic.$inject = ['Iconic', 'FoundationApi']

  function zfIconic(iconic, foundationApi) {
    var directive = {
      restrict: 'A',
      scope: {
        dynSrc: '=?',
        responsive: '=?'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      var ico = iconic.getAccess();
      if(scope.dynSrc) {
         attrs.$set('data-src', scope.dynSrc);
      } else {
        // To support expressions on data-src
        attrs.$set('data-src', attrs.src);
      }
      ico.inject(element[0]);

      if (scope.responsive) {

        foundationApi.subscribe('resize', function() {
          ico.update();
        });
      }
    }
  }

})();
