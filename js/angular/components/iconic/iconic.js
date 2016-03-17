(function () {
  'use strict';

  angular.module('foundation.iconic', [])
    .provider('Iconic', Iconic)
    .directive('zfIconic', zfIconic)
  ;

  // iconic wrapper
  function Iconic() {
    // default path
    var assetPath = 'assets/img/iconic/';

    /**
     * Sets the path used to locate the iconic SVG files
     * @param {string} path - the base path used to locate the iconic SVG files
     */
    this.setAssetPath = function (path) {
      assetPath = angular.isString(path) ? path : assetPath;
    };

    /**
     * Service implementation
     * @returns {{}}
     */
    this.$get = function () {
      var iconicObject = new IconicJS();

      var service = {
        getAccess: getAccess,
        getAssetPath: getAssetPath
      };

      return service;

      /**
       *
       * @returns {Window.IconicJS}
       */
      function getAccess() {
        return iconicObject;
      }

      /**
       *
       * @returns {string}
       */
      function getAssetPath() {
        return assetPath;
      }
    };
  }

  zfIconic.$inject = ['Iconic', 'FoundationApi', '$compile'];

  function zfIconic(iconic, foundationApi, $compile) {
    var directive = {
      restrict: 'A',
      template: '<img ng-transclude>',
      transclude: true,
      replace: true,
      scope: {
        dynSrc: '=?',
        dynIcon: '=?',
        dynIconAttrs: '=?',
        size: '@?',
        icon: '@',
        iconDir: '@?',
        iconAttrs: '=?'
      },
      compile: compile
    };

    return directive;

    function compile() {
      var contents, origAttrs, lastIconAttrs, assetPath;

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, element, attrs) {
        var iconAttrsObj, iconAttr;

        if (scope.iconDir) {
          // path set via attribute
          assetPath = scope.iconDir;
        } else {
          // default path
          assetPath = iconic.getAssetPath();
        }
        // make sure ends with /
        if (assetPath.charAt(assetPath.length - 1) !== '/') {
          assetPath += '/';
        }

        if (scope.dynSrc) {
          attrs.$set('data-src', scope.dynSrc);
        } else if (scope.dynIcon) {
          attrs.$set('data-src', assetPath + scope.dynIcon + '.svg');
        } else {
          if (scope.icon) {
            attrs.$set('data-src', assetPath + scope.icon + '.svg');
          } else {
            // To support expressions on data-src
            attrs.$set('data-src', attrs.src);
          }
        }

        // check if size already added as class
        if (!element.hasClass('iconic-sm') && !element.hasClass('iconic-md') && !element.hasClass('iconic-lg')) {
          var iconicClass;
          switch (scope.size) {
            case 'small':
              iconicClass = 'iconic-sm';
              break;
            case 'medium':
              iconicClass = 'iconic-md';
              break;
            case 'large':
              iconicClass = 'iconic-lg';
              break;
            default:
              iconicClass = 'iconic-fluid';
          }
          element.addClass(iconicClass);
        }

        // add static icon attributes to iconic element
        if (scope.iconAttrs) {
          iconAttrsObj = angular.fromJson(scope.iconAttrs);
          for (iconAttr in iconAttrsObj) {
            // add data- to attribute name if not already present
            attrs.$set(addDataDash(iconAttr), iconAttrsObj[iconAttr]);
          }
        }

        // save contents and attributes of un-inject html, to use for dynamic re-injection
        contents = element[0].outerHTML;
        origAttrs = element[0].attributes;
      }

      function postLink(scope, element, attrs) {
        var svgElement, ico = iconic.getAccess();

        injectSvg(element[0]);

        foundationApi.subscribe('resize', function () {
          // only run update on current element
          ico.update(element[0]);
        });

        // handle dynamic updating of src
        if (scope.dynSrc) {
          scope.$watch('dynSrc', function (newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
              reinjectSvg(scope.dynSrc, scope.dynIconAttrs);
            }
          });
        }
        // handle dynamic updating of icon
        if (scope.dynIcon) {
          scope.$watch('dynIcon', function (newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
              reinjectSvg(assetPath + scope.dynIcon + '.svg', scope.dynIconAttrs);
            }
          });
        }
        // handle dynamic updating of icon attrs
        scope.$watch('dynIconAttrs', function (newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            if (scope.dynSrc) {
              reinjectSvg(scope.dynSrc, scope.dynIconAttrs);
            } else {
              reinjectSvg(assetPath + scope.dynIcon + '.svg', scope.dynIconAttrs);
            }
          }
        });

        function reinjectSvg(newSrc, newAttrs) {
          var iconAttr;

          if (svgElement) {
            // set html
            svgElement.empty();
            svgElement.append(angular.element(contents));

            // remove 'data-icon' attribute added by injector as it
            // will cause issues with reinjection when changing icons
            svgElement.removeAttr('data-icon');

            // set new source
            svgElement.attr('data-src', newSrc);

            // add additional icon attributes to iconic element
            if (newAttrs) {
              // remove previously added attributes
              if (lastIconAttrs) {
                for (iconAttr in lastIconAttrs) {
                  svgElement.removeAttr(addDataDash(iconAttr));
                }
              }

              // add newly added attributes
              for (iconAttr in newAttrs) {
                // add data- to attribute name if not already present
                svgElement.attr(addDataDash(iconAttr), newAttrs[iconAttr]);
              }
            }

            // store current attrs
            lastIconAttrs = newAttrs;

            // reinject
            injectSvg(svgElement[0]);
          }
        }

        function injectSvg(element) {
          ico.inject(element, {
            each: function (injectedElem) {

              var i, angElem, elemScope;

              // wrap raw element
              angElem = angular.element(injectedElem);

              for(i = 0; i < origAttrs.length; i++) {
                // check if attribute should be ignored
                if (origAttrs[i].name !== 'zf-iconic' &&
                  origAttrs[i].name !== 'ng-transclude' &&
                  origAttrs[i].name !== 'icon' &&
                  origAttrs[i].name !== 'src') {
                  // check if attribute already exists on svg
                  if (angular.isUndefined(angElem.attr(origAttrs[i].name))) {
                    // add attribute to svg
                    angElem.attr(origAttrs[i].name, origAttrs[i].value);
                  }
                }
              }

              // compile
              elemScope = angElem.scope();
              if (elemScope) {
                svgElement = $compile(angElem)(elemScope);
              }
            }
          });
        }
      }

      function addDataDash(attr) {
        return attr.indexOf('data-') !== 0 ? 'data-' + attr : attr;
      }
    }
  }

})();
