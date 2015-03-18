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
   * zf-if-*
   */
    .directive('zfIfSmall', zfIfMediaWrapper('small'))
    .directive('zfIfMedium', zfIfMediaWrapper('medium'))
    .directive('zfIfLarge', zfIfMediaWrapper('large'))
    .directive('zfIfPortrait', zfIfMediaWrapper('portriate'))
    .directive('zfIfLandscape', zfIfMediaWrapper('landscape'))
    .directive('zfIfRetina', zfIfMediaWrapper('retina'))
  /*
   * zf-if-*-only
   */
    .directive('zfIfSmallOnly', zfIfMediaWrapper('small', true))
    .directive('zfIfMediumOnly', zfIfMediaWrapper('medium', true))
    .directive('zfIfLargeOnly', zfIfMediaWrapper('large', true))
  /*
   * zf-if-not-* (implies only, so zf-if-not-small will work as expected)
   */
    .directive('zfIfNotSmall', zfIfMediaWrapper('small', true, true))
    .directive('zfIfNotMedium', zfIfMediaWrapper('medium', true, true))
    .directive('zfIfNotLarge', zfIfMediaWrapper('large', true, true))
  ;
  
  function zfIfMediaWrapper(mediaQuery, mediaOnly, mediaNot) {
    // set optional parameter
    mediaOnly = mediaOnly || false;
    mediaNot = mediaNot || false;
    zfIfMedia.$inject = [ '$compile', 'FoundationApi', 'FoundationMQ'];
    
    return zfIfMedia;
    
    function zfIfMedia($compile, foundationApi, foundationMQ) {
      // create unique scope property for media query result 
      // must be unique to avoid collision with other zf-if-* scopes
      var mediaQueryProp = foundationApi.generateUuid().replace(/-/g,'');
      
      var directive = {
        priority: 601, // ng-if is 600, must compile this directive before
        restrict: 'A',
        link: link
      };

      return directive;

      // from here onward, scope[mediaQueryProp] refers to the result of running the provided media query
      function link(scope, element, attrs) {
        // initially set media query result to false
        scope[mediaQueryProp] = false;
        
        // update ng-if to include media query
        if (!attrs['ngIf']) {
          // must add ngIf directive and recompile
          element.attr('ng-if', mediaQueryProp);
          $compile(element)(scope);
          return;
        }

        // update ng-if attribute
        if (attrs['ngIf'] !== mediaQueryProp) {
          element.attr('ng-if', mediaQueryProp + ' && (' + attrs['ngIf'] + ')');
        }
        
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
