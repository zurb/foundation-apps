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

  zfIconic.$inject = ['Iconic']

  function zfIconic(iconic) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      var ico = iconic.getAccess();
      attrs.$set('data-src', attrs.src);
      ico.inject(element[0]);
    }
  }

})();
