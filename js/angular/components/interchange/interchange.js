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
  ;
  
  function zfIfMediaWrapper(mediaQuery, mediaOnly) {
    // set optional parameter
    mediaOnly = mediaOnly || false;
    zfIfMedia.$inject = [ '$compile', 'FoundationApi', 'FoundationMQ'];
    
    return zfIfMedia;
    
    function zfIfMedia($compile, foundationApi, foundationMQ) {
      // create unique scope property for media query result 
      // must be unique to avoid collision with other zf-if-* scopes
      var mediaQueryProp = foundationApi.generateUuid().replace(/-/g,'');
      
      var directive = {
        restrict: 'A',
        link: link
      };

      return directive;

      // from here onward, scope[mediaQueryResult] refers to the result of running the provided media query
      function link(scope, element, attrs) {
        var ngIfExpr;
        
        // initially set media query result to false
        scope[mediaQueryProp] = false;
        
        // check if already added the media check to this element (i.e. already processed)
        if (!attrs['ngIf'] || attrs['ngIf'].indexOf(mediaQueryProp) !== 0) {
          // haven't processed this element
          if (attrs['ngIf']) {
            // add the media check to the beginning of the original expression
            ngIfExpr = mediaQueryProp + ' && (' + attrs['ngIf'] + ')';
          } else {
            // just use the media check as the expression
            ngIfExpr = mediaQueryProp;
          }
          
          // add/update ng-if attribute
          element.attr('ng-if', ngIfExpr);
          
          // recompile to allow changes to ng-if directive to take effect
          $compile(element)(scope);
        }
        
        // subscribe for resize changes
        foundationApi.subscribe('resize', function(msg) {
          runQuery();
          scope.$digest();
        });

        // run first media query check
        runQuery();
        
        function runQuery() {
          var nextMediaQuery, nextMediaString, nextMediaMinWidthMatches, onlyMediaString;
          
          // run query
          if (!mediaOnly) {
            // run named query
            scope[mediaQueryProp] = matchesMedia(mediaQuery);
          } else {
            // run query with min-max range, by first getting media query string for next size up
            switch (mediaQuery) {
            case "small":
              nextMediaQuery = "medium"; break;
            case "medium":
              nextMediaQuery = "large"; break;
            case "large":
              nextMediaQuery = "xlarge"; break;
            }
            
            // extract min-width from next size up 
            nextMediaString = foundationMQ.getMediaQueries()[nextMediaQuery];
            nextMediaMinWidthMatches = nextMediaString.match(/min-width: ([0-9]+)em/);
            
            // subtract 1/16 from next size up min-width and add as max-width for current query
            onlyMediaString = foundationMQ.getMediaQueries()[mediaQuery];
            onlyMediaString += " and (max-width: " + (nextMediaMinWidthMatches[1] - (1/16)) + "em)";
            
            // run query with min-width and max-width
            scope[mediaQueryProp] = matchesMedia(onlyMediaString);
          }
        }
        
        function matchesMedia(query) {
          return foundationMQ.match([{media: query}]).length > 0;
        }
      }
    }
  }
})();
