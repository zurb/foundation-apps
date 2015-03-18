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
    .directive('zfIf', zfIfMediaFinal)
  /*
   * zf-if-*
   */
    .directive('zfIfSmall', zfIfMediaWrapper('zf-if-small', 'small'))
    .directive('zfIfMedium', zfIfMediaWrapper('zf-if-medium', 'medium'))
    .directive('zfIfLarge', zfIfMediaWrapper('zf-if-large', 'large'))
    .directive('zfIfPortrait', zfIfMediaWrapper('zf-if-portriate', 'portriate'))
    .directive('zfIfLandscape', zfIfMediaWrapper('zf-if-landscape', 'landscape'))
    .directive('zfIfRetina', zfIfMediaWrapper('zf-if-retina', 'retina'))
  /*
   * zf-if-*-only
   */
    .directive('zfIfSmallOnly', zfIfMediaWrapper('zf-if-small-only', 'small', true))
    .directive('zfIfMediumOnly', zfIfMediaWrapper('zf-if-medium-only', 'medium', true))
    .directive('zfIfLargeOnly', zfIfMediaWrapper('zf-if-large-only', 'large', true))
  /*
   * zf-if-not-* (implies only, so zf-if-not-small will on be visible on small screens, not all screens)
   */
    .directive('zfIfNotSmall', zfIfMediaWrapper('zf-if-not-small', 'small', true, true))
    .directive('zfIfNotMedium', zfIfMediaWrapper('zf-if-not-medium', 'medium', true, true))
    .directive('zfIfNotLarge', zfIfMediaWrapper('zf-if-not-large', 'large', true, true))
  ;
  
  /*
   * This directive will configure ng-if and zf-if directives and then recompile
   */
  function zfIfMediaWrapper(directiveName, mediaQuery, mediaOnly, mediaNot) {
    // set optional parameter
    mediaOnly = mediaOnly || false;
    mediaNot = mediaNot || false;

    zfIfMedia.$inject = [ '$compile', 'FoundationApi'];
    return zfIfMedia;
    
    function zfIfMedia($compile, foundationApi) {
      // create unique scope property for media query result 
      // must be unique to avoid collision with other zf-if-* scopes
      var mediaQueryProp = (directiveName + '_' + foundationApi.generateUuid()).replace(/-/g,'');
      
      var directive = {
        priority: 1000, // must compile directive before any others
        terminal: true, // don't compile any other directive after this
                        // we'll fix this with a recompile
        restrict: 'A',
        compile: compile
      };

      return directive;

      // from here onward, scope[mediaQueryProp] refers to the result of running the provided media query
      function compile(element, attrs) {
        // set attributes to be read by zf-if directive
        element.attr('zf-if-param-scope-prop', mediaQueryProp);
        element.attr('zf-if-param-media', mediaQuery);
        element.attr('zf-if-param-only', mediaOnly);
        element.attr('zf-if-param-not', mediaNot);
        
        // add zf-if directive
        element.attr('zf-if', 'zf-if');

        // add/update ng-if attribute
        if (!attrs['ngIf']) {
          element.attr('ng-if', mediaQueryProp);
        } else {
          element.attr('ng-if', mediaQueryProp + ' && (' + attrs['ngIf'] + ')');
        }
        
        // remove current directive to avoid infinite recompile
        element.removeAttr(directiveName);
        element.removeAttr('data-' + directiveName); // also check if user used data-* styling
        
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

  zfIfMediaFinal.$inject = [ '$compile', 'FoundationApi', 'FoundationMQ'];
  function zfIfMediaFinal($compile, foundationApi, foundationMQ) {
    var directive = {
      priority: 601, // must compiled before ng-if (600)
      restrict: 'A',
      compile: function compile(element, attrs) {
        return compileWrapper(attrs['zfIfParamScopeProp'], attrs['zfIfParamMedia'], attrs['zfIfParamOnly'] === "true", attrs['zfIfParamNot'] === "true");
      }
    };

    return directive;

    // parameters will be populated with values provided from zf-if-param-* directive
    function compileWrapper(mediaQueryProp, mediaQuery, mediaOnly, mediaNot) {
      return {
        pre: preLink,
        post: postLink
      }
      
      // from here onward, scope[mediaQueryProp] refers to the result of running the provided media query
      function preLink(scope, element, attrs) {
        // initially set media query result to false
        scope[mediaQueryProp] = false;
      }

      function postLink(scope, element, attrs) {
        // subscribe for resize changes
        foundationApi.subscribe('resize', function(msg) {
          var orignalVisibilty = scope[mediaQueryProp];
          runQuery();
          if (orignalVisibilty != scope[mediaQueryProp]) {
            // digest if visibility changed
            scope.$digest();
          }
        });

        // run first media query check
        runQuery();
        
        function runQuery() {
          var mediaUpQuery, mediaUpMinWidth, onlyMediaQuery;
          
          if (!mediaOnly) {
            // run named query
            scope[mediaQueryProp] = matchesMedia(mediaQuery);
          } else {
            // run query with min-max range, by first getting media query string for next size up
            switch (mediaQuery) {
            case "small":
              mediaUpQuery = "medium"; break;
            case "medium":
              mediaUpQuery = "large"; break;
            case "large":
              mediaUpQuery = null;  break;
            }
            
            if (!mediaNot) {
              if (!mediaUpQuery) {
                // reached max media size, run query for current media
                scope[mediaQueryProp] = matchesMedia(mediaQuery);
              } else {
                // extract min-width from next size up
                mediaUpMinWidth = getMinWidthFromQuery(mediaUpQuery);
                
                // subtract 1/16 from the min width and use as max-width for current query
                onlyMediaQuery = addMaxWidthToQuery(mediaQuery, mediaUpMinWidth - (1/16))
                
                // run query with min-width and max-width
                scope[mediaQueryProp] = matchesMedia(onlyMediaQuery);
              }
            } else {
              // require that the media doesn't match the current query
              if (matchesMedia(mediaQuery)) {
                // if it does match, make sure it also matches the next up media
                scope[mediaQueryProp] = matchesMedia(mediaUpQuery)
              } else {
                // media doesn't match
                scope[mediaQueryProp] = true;
              }
            }
          }
        }
        
        function matchesMedia(query) {
          return foundationMQ.match([{media: query}]).length > 0;
        }
        
        function getMinWidthFromQuery(query) {
          var mediaString = foundationMQ.getMediaQueries()[query];
          var matches = mediaString.match(/min-width: ([0-9]+)em/);
          return matches[1];
        }
        
        function addMaxWidthToQuery(query, maxWidth) {
          var mediaString = foundationMQ.getMediaQueries()[query];
          return mediaString + " and (max-width: " + maxWidth + "em)";
        }
      }
    }
  }
})();
