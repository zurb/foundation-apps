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

  zfIconic.$inject = ['Iconic', 'FoundationApi', '$compile', '$location']

  function zfIconic(iconic, foundationApi, $compile, $location) {
    var directive = {
      restrict: 'A',
      template: '<img ng-transclude>',
      transclude: true,
      replace: true,
      scope: {
        dynSrc: '=?',
        dynIcon: '=?',
        size: '@?',
        icon: '@'
      },
      compile: compile
    };

    return directive;

    function compile() {
      var contents, assetPath = 'assets/img/iconic/';
      
      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs, ctrl, transclude) {
        if(scope.dynSrc) {
          iAttrs.$set('data-src', scope.dynSrc);
        } else if(scope.dynIcon) {
          iAttrs.$set('data-src', assetPath + scope.dynIcon + '.svg');
        } else {
          if (scope.icon) {
            iAttrs.$set('data-src', assetPath + scope.icon + '.svg');
          } else {
            // To support expressions on data-src
            iAttrs.$set('data-src', iAttrs.src);
          }
        }

        var iconicClass;
        switch (scope.size) {
          case 'small':
            iconicClass = 'iconic-sm'
            break;
          case 'medium':
            iconicClass = 'iconic-md'
            break;
          case 'large':
            iconicClass = 'iconic-lg'
            break;
          default:
            iconicClass = 'iconic-fluid'
        }
        angular.element(iElement).addClass(iconicClass);
        
        // save contents of un-inject html, to use for dynamic re-injection
        contents = iElement[0].outerHTML;
      }

      function postLink(scope, element, attrs) {
        var svgElement, ico = iconic.getAccess();

        injectSvg(element[0]);

        foundationApi.subscribe('resize', function() {
          // only run update on current element
          ico.update(element[0]);
        });
        
        // handle dynamic updating of icon
        if(scope.dynSrc) {
          scope.$watch('dynSrc', function(newVal, oldVal) {
            if (newVal && newVal != oldVal) {
              reinjectSvg(scope.dynSrc);
            }
          });
        }
        if (scope.dynIcon) {
          scope.$watch('dynIcon', function(newVal, oldVal) {
            if (newVal && newVal != oldVal) {
              reinjectSvg(assetPath + scope.dynIcon + '.svg');
            }
          });
        }
        
        function reinjectSvg(newSrc) {
          if (svgElement) {
            // set html
            svgElement.empty();
            svgElement.append(angular.element(contents));
            
            // set new source
            svgElement.attr('data-src', newSrc);
            
            // reinject
            injectSvg(svgElement[0]);
          }
        }

        function injectSvg(element) {
          ico.inject(element, {
            each: function(injectedElem) {
              var angElem = angular.element(injectedElem);
              svgElement = $compile(angElem)(angElem.scope());
            }
          });
        }
      }
    }
  }

})();