(function() {
  'use strict';

  angular.module('foundation.interchange', ['foundation.core', 'foundation.mediaquery'])
    .directive('zfInterchange', zfInterchange)
  ;

  zfInterchange.$inject = [ '$compile', '$http', '$templateCache', 'FoundationApi', 'FoundationMQ'];

  function zfInterchange($compile, $http, $templateCache, foundationApi, foundationMQ) {

    var directive = {
      restrict: 'EA',
      transclude: 'element',
      scope: {
        position: '@'
      },
      replace: true,
      template: '<div></div>',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrl, transclude) {
      var childScope, current, scenarios, innerTemplates;

      var globalQueries = foundationMQ.getMediaQueries();

      //setup
      foundationApi.subscribe('resize', function(msg) {
        transclude(function(clone, newScope) {
          if(!scenarios || !innerTemplates) {
            collectInformation(clone);
          }

          var ruleMatches = foundationMQ.match(scenarios);
          var scenario = ruleMatches.length === 0 ? null : scenarios[ruleMatches[0].ind];

          //this could use some love
          if(scenario && checkScenario(scenario)) {
            var compiled;

            if(childScope) {
              childScope.$destroy();
              childScope = null;
            }

            if(typeof scenario.templ !== 'undefined') {
              childScope = newScope;

              //temp container
              var tmp = document.createElement('div');
              tmp.appendChild(innerTemplates[scenario.templ][0]);

              element.html(tmp.innerHTML);
              $compile(element.contents())(childScope);
              current = scenario;
            } else {
              var loader = templateLoader(scenario.src);
              loader.success(function(html) {
                childScope = newScope;
                element.html(html);
              }).then(function(){
                $compile(element.contents())(childScope);
                current = scenario;
              });
            }
          }
        });

      });

      //init
      foundationApi.publish('resize', 'initial resize');

      function templateLoader(templateUrl) {
        return $http.get(templateUrl, {cache: $templateCache});
      }

      function collectInformation(el) {
        var data = foundationMQ.collectScenariosFromElement(el);

        scenarios = data.scenarios;
        innerTemplates = data.templates;
      }

      function checkScenario(scenario) {
        return !current || current !== scenario;
      }
    }
  }

  angular.module('foundation.interchange')
  /*
   * Final directive to perform media/element queries, other directives set up this one
   * (See: http://stackoverflow.com/questions/19224028/add-directives-from-directive-in-angularjs)
   */
    .directive('zfQuery', zfQuery)
  /*
   * zf-if-*
   */
    .directive('zfIfSmall', zfIf('small'))
    .directive('zfIfMedium', zfIf('medium'))
    .directive('zfIfLarge', zfIf('large'))
    .directive('zfIfPortrait', zfIf('portrait'))
    .directive('zfIfLandscape', zfIf('landscape'))
    .directive('zfIfRetina', zfIf('retina'))
    .directive('zfIfSmallOnly', zfIf('small', true))
    .directive('zfIfMediumOnly', zfIf('medium', true))
    .directive('zfIfLargeOnly', zfIf('large', true))
    .directive('zfIfNotSmall', zfIf('small', true, true))
    .directive('zfIfNotMedium', zfIf('medium', true, true))
    .directive('zfIfNotLarge', zfIf('large', true, true))
  /*
   * zf-show-*
   */
    .directive('zfShowSmall', zfShow('small'))
    .directive('zfShowMedium', zfShow('medium'))
    .directive('zfShowLarge', zfShow('large'))
    .directive('zfShowPortrait', zfShow('portrait'))
    .directive('zfShowLandscape', zfShow('landscape'))
    .directive('zfShowRetina', zfShow('retina'))
    .directive('zfShowSmallOnly', zfShow('small', true))
    .directive('zfShowMediumOnly', zfShow('medium', true))
    .directive('zfShowLargeOnly', zfShow('large', true))
    .directive('zfShowNotSmall', zfShow('small', true, true))
    .directive('zfShowNotMedium', zfShow('medium', true, true))
    .directive('zfShowNotLarge', zfShow('large', true, true))
  /*
   * zf-hide-*
   */
    .directive('zfHideSmall', zfHide('small'))
    .directive('zfHideMedium', zfHide('medium'))
    .directive('zfHideLarge', zfHide('large'))
    .directive('zfHidePortrait', zfHide('portrait'))
    .directive('zfHideLandscape', zfHide('landscape'))
    .directive('zfHideRetina', zfHide('retina'))
    .directive('zfHideSmallOnly', zfHide('small', true))
    .directive('zfHideMediumOnly', zfHide('medium', true))
    .directive('zfHideLargeOnly', zfHide('large', true))
    .directive('zfHideNotSmall', zfHide('small', true, true))
    .directive('zfHideNotMedium', zfHide('medium', true, true))
    .directive('zfHideNotLarge', zfHide('large', true, true))
  /*
   * Directive which enables responsive elements
   */
    .directive('zfResponsiveElement', zfResponsiveElement)
  ;

  function zfIf(namedQuery, queryOnly, queryNot) {
    return zfQueryWrapper('ng-if', 'zf-if', namedQuery, queryOnly, queryNot);
  }
  function zfShow(namedQuery, queryOnly, queryNot) {
    return zfQueryWrapper('ng-show', 'zf-show', namedQuery, queryOnly, queryNot);
  }
  function zfHide(namedQuery, queryOnly, queryNot) {
    return zfQueryWrapper('ng-hide', 'zf-hide', namedQuery, queryOnly, queryNot);
  }

  /*
   * This directive will configure ng-if/ng-show/ng-hide and zf-query directives and then recompile the element
   */
  function zfQueryWrapper(angularDirective, directiveName, namedQuery, queryOnly, queryNot) {
    // set optional parameter
    queryOnly = queryOnly || false;
    queryNot = queryNot || false;

    // generate directive name
    if (queryNot) directiveName += '-not';
    directiveName += '-' + namedQuery;
    if (queryOnly && !queryNot) directiveName += '-only';

    zfQueryDirective.$inject = [ '$compile', 'FoundationApi'];
    return zfQueryDirective;

    function zfQueryDirective($compile, foundationApi) {
      // create unique scope property for media query result, must be unique to avoid collision with other properties of zf-query scope
      // property set upon element compilation or else all similar directives (i.e. zf-if-*/zf-show-*/zf-hide-*) will get the same value
      var queryResult;

      var directive = {
        priority: 1000, // must compile directive before any others
        terminal: true, // don't compile any other directive after this
                        // we'll fix this with a recompile
        restrict: 'A',
        compile: compile
      };

      return directive;

      // From here onward, scope[queryResult] refers to the result of running the provided query
      // against either the media or element as specified by the zf-query-type attribute.
      function compile(element, attrs) {
        var zfValue, ngValue;

        // set unique property
        queryResult = (directiveName + foundationApi.generateUuid()).replace(/-/g,'');

        // add zf-query directive and configuration attributes
        element.attr('zf-query', namedQuery);
        element.attr('zf-query-not', queryNot);
        element.attr('zf-query-only', queryOnly);
        element.attr('zf-query-scope-prop', queryResult);

        // check if value was given to directive attribute, if so pass to angular directive
        zfValue = element.attr(directiveName) ||  element.attr('data-' + directiveName);
        if (zfValue) {
          ngValue = "(" + zfValue + " && " + queryResult + ")";
        } else {
          ngValue = queryResult;
        }

        // add/update angular directive
        if (!element.attr(angularDirective)) {
          element.attr(angularDirective, ngValue);
        } else {
          element.attr(angularDirective, ngValue + ' && (' + element.attr(angularDirective) + ')');
        }

        // remove directive from currnet element to avoid infinite recompile
        element.removeAttr(directiveName);
        element.removeAttr('data-' + directiveName);

        return {
          pre: function (scope, element, attrs) {
          },
          post: function (scope, element, attrs) {
            // recompile
            $compile(element)(scope);
          }
        }
      }
    }
  }

  zfQuery.$inject = ['FoundationApi', 'FoundationMQ'];
  function zfQuery(foundationApi, foundationMQ) {
    var directive = {
      priority: 601, // must compile before ng-if (600)
      restrict: 'A',
      compile: function compile(element, attrs) {
        return compileWrapper(attrs['zfQueryScopeProp'], attrs['zfQuery'], attrs['zfQueryType'], attrs['zfQueryOnly'] === "true", attrs['zfQueryNot'] === "true");
      }
    };

    return directive;

    // parameters will be populated with values provided from zf-query-* attributes
    function compileWrapper(queryResult, namedQuery, queryType, queryOnly, queryNot) {
      var isQuerySize = namedQuery == "small" || namedQuery == "medium" || namedQuery == "large";
      var mediaUpMap = {
        "small": "medium",
        "medium": "large",
        "large": null
      };

      // set defaults
      queryType = queryType == "element" ? "element" : "media";
      queryOnly = queryOnly || false;
      queryNot = queryNot || false;

      // validations
      if (!isQuerySize && queryType == "element") {
        throw "Named query '" + namedQuery + "' is supported with element queries. Only size queries (small/medium/large) are supported.";
      }

      return {
        pre: preLink,
        post: postLink
      }

      // From here onward, scope[queryResult] refers to the result of running the provided media query
      // against either the media or element as specified by the zf-if-type attribute.
      function preLink(scope, element, attrs) {
        // initially set media query result to false
        scope[queryResult] = false;
      }

      function postLink(scope, element, attrs) {
        // subscribe for resize events
        foundationApi.subscribe('resize', function() {
          var orignalVisibilty = scope[queryResult];
          runQuery();
          if (orignalVisibilty != scope[queryResult]) {
            // digest if visibility changed
            scope.$digest();
          }
        });

        scope.$on("$destroy", function() {
          foundationApi.unsubscribe('resize');
        });

        // run first media query check
        runQuery();

        function runQuery() {
          var mediaUpNamedQuery,
              matchesQuery = queryType === 'element' ? matchesElement : matchesMedia;

          if (!queryOnly) {
            // run named query
            scope[queryResult] = matchesQuery(namedQuery);
          } else {
            mediaUpNamedQuery = mediaUpMap[namedQuery];

            if (!queryNot) {
              /*
               * Check that media ONLY matches named query and nothing else
               */
              if (!mediaUpNamedQuery) {
                // reached max media size, run query for current media
                scope[queryResult] = matchesQuery(namedQuery);
              } else {
                // must match this media size, but not the size up
                scope[queryResult] = matchesQuery(namedQuery) && !matchesQuery(mediaUpNamedQuery);
              }
            } else {
              /*
               * Check that media does NOT match named query
               */
              // require that the media doesn't match the current query
              if (!matchesQuery(namedQuery)) {
                // media doesn't match
                scope[queryResult] = true;
              } else {
                // if it does match, make sure it also matches the next up media
                if (!mediaUpNamedQuery) {
                  // no next size up, means media still matches
                  scope[queryResult] = false;
                } else {
                  scope[queryResult] = matchesQuery(mediaUpNamedQuery);
                }
              }
            }
          }
        }

        function matchesMedia(query) {
          return foundationMQ.matchesMedia(query);
        }

        function matchesElement(query) {
          // use width of the element's parent for element query
          // similar to how the root element is used for media queries
          return foundationMQ.matchesElement(element.parent(), query);
        }
      }
    }
  }

  zfResponsiveElement.$inject = ['$timeout', 'FoundationApi', 'FoundationMQ'];
  function zfResponsiveElement($timeout, foundationApi, foundationMQ) {
    var directive = {
      restrict: 'A',
      compile: compile
    };

    return directive;

    function compile(element, attrs) {
      var currClass,
          isRoot = angular.isUndefined(element.parent().attr('zf-responsive-element'));

      if (isRoot) {
        // add directive to all child grid elements
        angular.element(element[0].querySelectorAll('.grid-block')).attr('zf-responsive-element', 'zf-responsive-element');
        angular.element(element[0].querySelectorAll('.grid-content')).attr('zf-responsive-element', 'zf-responsive-element');
      }

      return {
        pre: function (scope, element, attrs) {
        },
        post: function (scope, element, attrs) {
          addResizeListener(element[0], handleResize);

          scope.$on("$destroy", function() {
            removeResizeListener(element[0], handleResize);
          });

          update();

          function handleResize() {
            if (update()) {
              // digest if visibility changed
              scope.$digest();
            }
          }

          function update() {
            var newClass = currClass;
            if (foundationMQ.matchesElement(element, 'large')) {
              newClass = 'is-large';
            } else if (foundationMQ.matchesElement(element, 'medium')) {
              newClass = 'is-medium';
            } else if (foundationMQ.matchesElement(element, 'small')) {
              newClass = 'is-small';
            }
            if (newClass != currClass) {
              element.removeClass(currClass);
              element.addClass(newClass);
              currClass = newClass;
              return true;
            } else {
              return false;
            }
          }
        }
      };
    }
  }
})();
