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
  function zfIfMediaWrapper(directiveName, mediaQuery, queryOnly, queryNot) {
    // set optional parameter
    queryOnly = queryOnly || false;
    queryNot = queryNot || false;

    zfIfMedia.$inject = [ '$compile', 'FoundationApi'];
    return zfIfMedia;
    
    function zfIfMedia($compile, foundationApi) {
      // create unique scope property for media query results
      // must be unique to avoid collision with other zf-if-* scopes
      // property set upon element compilation
      var mediaQueryProp;
      
      var directive = {
        priority: 1000, // must compile directive before any others
        terminal: true, // don't compile any other directive after this
                        // we'll fix this with a recompile
        restrict: 'A',
        compile: compile
      };

      return directive;

      // From here onward, scope[mediaQueryProp] refers to the result of running the provided media query
      // against either the media or element as specified by the zf-if-type attribute.
      function compile(element, attrs) {
        // assign unique name
        mediaQueryProp = (directiveName + foundationApi.generateUuid()).replace(/-/g,'');
        
        // set attributes to be read by zf-if directive
        element.attr('zf-if-scope-prop', mediaQueryProp);
        element.attr('zf-if-query', mediaQuery);
        element.attr('zf-if-only', queryOnly);
        element.attr('zf-if-not', queryNot);
        
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
      priority: 601, // must compile before ng-if (600)
      restrict: 'A',
      compile: function compile(element, attrs) {
        return compileWrapper(attrs['zfIfScopeProp'], attrs['zfIfQuery'], attrs['zfIfType'], attrs['zfIfOnly'] === "true", attrs['zfIfNot'] === "true");
      }
    };

    return directive;

    // parameters will be populated with values provided from zf-if-* attributes
    function compileWrapper(mediaQueryProp, mediaQuery, queryType, queryOnly, queryNot) {
      var isQuerySize = mediaQuery == "small" || mediaQuery == "medium" || mediaQuery == "large";
      
      // set defaults
      queryType = queryType == "element" ? "element" : "media";
      queryOnly = queryOnly || false;
      queryNot = queryNot || false;
      
      // validations
      if (!isQuerySize && queryType == "element") {
        throw "Media query '" + mediaQuery + "' is supported with element queries. Only size queries (small/medium/large) are supported.";
      }
      
      return {
        pre: preLink,
        post: postLink
      }

      // From here onward, scope[mediaQueryProp] refers to the result of running the provided media query
      // against either the media or element as specified by the zf-if-type attribute.
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
          var mediaUpQuery,
              matchesQuery = (queryType === 'element' && isQuerySize) ? matchesElement : matchesMedia;
          
          if (!queryOnly) {
            // run named query
            scope[mediaQueryProp] = matchesQuery(mediaQuery);
          } else {
            // first get media query string for next size up
            switch (mediaQuery) {
            case "small":
              mediaUpQuery = "medium"; break;
            case "medium":
              mediaUpQuery = "large"; break;
            case "large":
              mediaUpQuery = null;  break;
            }
            
            if (!queryNot) {
              /*
               * Check that media ONLY matches named query and nothing else
               */
              if (!mediaUpQuery) {
                // reached max media size, run query for current media
                scope[mediaQueryProp] = matchesQuery(mediaQuery);
              } else {
                // must match this media size, but not the size up
                scope[mediaQueryProp] = matchesQuery(mediaQuery) && !matchesQuery(mediaUpQuery);
              }
            } else {
              /*
               * Check that media does NOT match named query
               */
              // require that the media doesn't match the current query
              if (!matchesQuery(mediaQuery)) {
                // media doesn't match
                scope[mediaQueryProp] = true;
              } else {
                // if it does match, make sure it also matches the next up media
                if (!mediaUpQuery) {
                  // no next size up, means media still matches
                  scope[mediaQueryProp] = false;
                } else {
                  scope[mediaQueryProp] = matchesQuery(mediaUpQuery);
                }
              }
            }
          }
        }
        
        /** Source adapted from here: https://github.com/marcj/css-element-queries/blob/master/src/ElementQueries.js
          * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
          */
        function getEmSize(element) {
            var fontSize = element.prop('fontSize');
            return parseFloat(fontSize) || 16;
        }
        
        function convertToPx(value) {
            var units = value.replace(/[0-9]*/, '');
            value = parseFloat(value);
            switch (units) {
                case "px":
                    return value;
                case "em":
                    // use directive element
                    return value * getEmSize(element);
                case "rem":
                    // use document element
                    return value * getEmSize(angular.element(document.documentElement));
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case "vw":
                    return value * document.documentElement.clientWidth / 100;
                case "vh":
                    return value * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === "vmin" ? "min" : "max"];
                    return value * chooser(vw, vh);
                default:
                    return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }
        /**
         * end @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
         */
        
        function matchesMedia(query) {
          return foundationMQ.match([{media: query}]).length > 0;
        }
        
        function matchesElement(query) {
          // use width of the element's parent for element query
          // similar to how the root element is used for media queries
          var parentElemWidth = element.parent().prop('offsetWidth');
          
          // extract min-width from query
          var elemQueryMinWidth = getMinWidthInPxFromQuery(query);
          
          // check if element matches query
          return parentElemWidth >= elemQueryMinWidth;
        }
        
        function getMinWidthInPxFromQuery(query) {
          var mediaString = foundationMQ.getMediaQueries()[query];
          var matches = mediaString.match(/min-width: ([0-9]+)(em|px|rem|vw|vh|vmin|vmax|)/);
          if (matches && matches.length == 3) {
            return convertToPx(matches[1] + matches[2]);
          } else {
            return 0;
          }
        }
        
        function getMaxWidthInPxFromQuery(query) {
          var mediaString = foundationMQ.getMediaQueries()[query];
          var matches = mediaString.match(/max-width: ([0-9]+)(em|px|rem|vw|vh|vmin|vmax|)/);
          if (matches && matches.length == 3) {
            return convertToPx(matches[1] + matches[2]);
          } else {
            return 0;
          }
        }
        
        function addMaxWidthInPxToQuery(query, maxWidth) {
          var mediaString = foundationMQ.getMediaQueries()[query];
          return mediaString + " and (max-width: " + maxWidth + "px)";
        }
      }
    }
  }
})();
