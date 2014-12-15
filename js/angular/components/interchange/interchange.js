(function() {
  'use strict';

  angular.module('foundation.interchange', ['foundation.core'])
    .directive('zfInterchange', zfInterchange)
  ;

  zfInterchange.$inject = ['FoundationApi', '$compile', '$http', '$templateCache', '$animate'];

  function zfInterchange(foundationApi, $compile, $http, $templateCache) {

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

      var namedQueries = {
        'default' : 'only screen',
        landscape : 'only screen and (orientation: landscape)',
        portrait : 'only screen and (orientation: portrait)',
        retina : 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
          'only screen and (min--moz-device-pixel-ratio: 2),' +
          'only screen and (-o-min-device-pixel-ratio: 2/1),' +
          'only screen and (min-device-pixel-ratio: 2),' +
          'only screen and (min-resolution: 192dpi),' +
          'only screen and (min-resolution: 2dppx)'
      };

      var globalQueries = foundationApi.getSettings().mediaQueries;
      namedQueries = angular.extend(namedQueries, globalQueries);

      //setup
      foundationApi.subscribe('resize', function(msg) {
        transclude(function(clone, newScope) {
          if(!scenarios || !innerTemplates) {
            collectInformation(clone);
          }

          var ruleMatches = matched();
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

      function matched() {
        var count   = scenarios.length;
        var matches = [];

        if (count > 0) {
          while (count--) {
            var mq;
            var rule = scenarios[count].media;

            if (namedQueries[rule]) {
              mq = matchMedia(namedQueries[rule]);
            } else {
              mq = matchMedia(rule);
            }

            if (mq.matches) {
              matches.push({ ind: count});
            }
          }
        }

        return matches;
      }

      function collectInformation(parentElement) {
        scenarios      = [];
        innerTemplates = [];

        var elements = parentElement.children();
        var i        = 0;

        angular.forEach(elements, function(el) {
          var elem = angular.element(el);


          //if no source or no html, capture element itself
          if (!elem.attr('src') || !elem.attr('src').match(/.html$/)) {
            innerTemplates[i] = elem;
            scenarios[i] = { media: elem.attr('media'), templ: i };
          } else {
            scenarios[i] = { media: elem.attr('media'), src: elem.attr('src') };
          }

          i++;
        });
      }

      function checkScenario(scenario) {
        return !current || current !== scenario;
      }
    }
  }

})();
