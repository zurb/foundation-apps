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
   * Final directive to perform media queries, other directives set up this one
   * (See: http://stackoverflow.com/questions/19224028/add-directives-from-directive-in-angularjs)
   */
    .directive('zfQuery', zfQuery)
  /*
   * zf-if / zf-show / zf-hide
   */
    .directive('zfIf', zfQueryDirective('ng-if', 'zf-if'))
    .directive('zfShow', zfQueryDirective('ng-show', 'zf-show'))
    .directive('zfHide', zfQueryDirective('ng-hide', 'zf-hide'))
  ;

  /*
   * This directive will configure ng-if/ng-show/ng-hide and zf-query directives and then recompile the element
   */
  function zfQueryDirective(angularDirective, directiveName) {
    return ['$compile', 'FoundationApi', function ($compile, foundationApi) {
      // create unique scope property for media query result, must be unique to avoid collision with other zf-query directives
      // property set upon element compilation or else all similar directives (i.e. zf-if-*/zf-show-*/zf-hide-*) will get the same value
      var queryResult;

      return {
        priority: 1000, // must compile directive before any others
        terminal: true, // don't compile any other directive after this
                        // we'll fix this with a recompile
        restrict: 'A',
        compile: compile
      };

      // From here onward, scope[queryResult] refers to the result of running the provided query
      function compile(element, attrs) {
        var previousParam;

        // set unique property
        queryResult = (directiveName + foundationApi.generateUuid()).replace(/-/g,'');

        // set default configuration
        element.attr('zf-query-not', false);
        element.attr('zf-query-only', false);
        element.attr('zf-query-or-smaller', false);
        element.attr('zf-query-scope-prop', queryResult);

        // parse directive attribute for query parameters
        element.attr(directiveName).split(' ').forEach(function(param) {
          if (param) {
            // add zf-query directive and configuration attributes
            switch (param) {
              case "not":
                element.attr('zf-query-not', true);
                element.attr('zf-query-only', true);
                break;
              case "only":
                element.attr('zf-query-only', true);
                break;
              case "or":
                break;
              case "smaller":
                // allow usage of smaller keyword if preceeded by 'or' keyword
                if (previousParam === "or") {
                  element.attr('zf-query-or-smaller', true);
                }
                break;
              default:
                element.attr('zf-query', param);
                break;
            }

            previousParam = param;
          }
        });

        // add/update angular directive
        if (!element.attr(angularDirective)) {
          element.attr(angularDirective, queryResult);
        } else {
          element.attr(angularDirective, queryResult + ' && (' + element.attr(angularDirective) + ')');
        }

        // remove directive from current element to avoid infinite recompile
        element.removeAttr(directiveName);
        element.removeAttr('data-' + directiveName);

        return {
          pre: function (scope, element, attrs) {
          },
          post: function (scope, element, attrs) {
            // recompile
            $compile(element)(scope);
          }
        };
      }
    }];
  }

  zfQuery.$inject = ['FoundationApi', 'FoundationMQ'];
  function zfQuery(foundationApi, foundationMQ) {
    return {
      priority: 601, // must compile before ng-if (600)
      restrict: 'A',
      compile: function compile(element, attrs) {
        return compileWrapper(attrs['zfQueryScopeProp'],
                              attrs['zfQuery'],
                              attrs['zfQueryOnly'] === "true",
                              attrs['zfQueryNot'] === "true",
                              attrs['zfQueryOrSmaller'] === "true");
      }
    };

    // parameters will be populated with values provided from zf-query-* attributes
    function compileWrapper(queryResult, namedQuery, queryOnly, queryNot, queryOrSmaller) {
      // set defaults
      queryOnly = queryOnly || false;
      queryNot = queryNot || false;

      return {
        pre: preLink,
        post: postLink
      };

      // From here onward, scope[queryResult] refers to the result of running the provided query
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
          if (!queryOnly) {
            if (!queryOrSmaller) {
              // Check if matches media or LARGER
              scope[queryResult] = foundationMQ.matchesMedia(namedQuery);
            } else {
              // Check if matches media or SMALLER
              scope[queryResult] = foundationMQ.matchesMediaOrSmaller(namedQuery);
            }
          } else {
            if (!queryNot) {
              // Check that media ONLY matches named query and nothing else
              scope[queryResult] = foundationMQ.matchesMediaOnly(namedQuery);
            } else {
              // Check that media does NOT match named query
              scope[queryResult] = !foundationMQ.matchesMediaOnly(namedQuery);
            }
          }
        }
      }
    }
  }
})();
