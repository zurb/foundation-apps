angular.module('foundation.interchange', []);

angular.module('foundation.interchange')
  .directive('faInterchange', ['FoundationApi', '$compile', '$http', '$templateCache', '$animate',  function(foundationApi, $compile, $http, $templateCache) {
  var templateLoader = function(templateUrl) {
    return $http.get(templateUrl, {cache: $templateCache});
  };

  return {
    restrict: 'A',
    transclude: 'element',
    scope: {
      position: '@'
    },
    replace: true,
    template: '<div></div>',
    link: function(scope, element, attrs, ctrl, transclude) {
      var childScope, current, scenarios;

      var named_queries = {
        'default' : 'only screen',
        small : 'only screen',
        medium : 'only screen and (min-width:40.063em)',
        large : 'only screen and (min-width:64.063em)',
        xlarge : 'only screen and (min-width:90.063em)',
        xxlarge: 'only screen and (min-width:120.063em)',
        landscape : 'only screen and (orientation: landscape)',
        portrait : 'only screen and (orientation: portrait)',
        retina : 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
          'only screen and (min--moz-device-pixel-ratio: 2),' +
          'only screen and (-o-min-device-pixel-ratio: 2/1),' +
          'only screen and (min-device-pixel-ratio: 2),' +
          'only screen and (min-resolution: 192dpi),' +
          'only screen and (min-resolution: 2dppx)'
      };

      var matched = function() {
        var count = scenarios.length;
        var matches = [];

        if (count > 0) {
          while (count--) {
            var mq;
            var rule = scenarios[count].media;
            if (named_queries[rule]) {
              mq = matchMedia(named_queries[rule]);
            } else {
              mq = matchMedia(rule);
            }
            if (mq.matches) {
              matches.push({ ind: count});
            }
          }
        }
        return matches;
      };

      var collectScenarios = function(parentElement) {
        scenarios = [];
        var elements = parentElement.children();
        var i = 0;

        angular.forEach(elements, function(el) {
          var elem = angular.element(el);
          scenarios[i] = { media: elem.attr('media'), src: elem.attr('src') };
          i++;
        });

      };

      //setup
      foundationApi.subscribe('resize', function(msg) {
        transclude(function(clone, newScope) {
          if(!scope.scenarios) {
            collectScenarios(clone);
          }
          var ruleMatches = matched();
          var scenario = scenarios[ruleMatches[0].ind];

          if(scenarios == current) {

          } else {
            var compiled;
            var loader = templateLoader(scenario.src);

            if(childScope) {
              childScope.$destroy();
              childScope = null;
            }

            loader.success(function(html) {
              childScope = newScope;
              compiled = $compile(html)(childScope);
            }).then(function(){
              element.html(compiled.html());
              current = scenario;
            });
          }
        });

      });

      foundationApi.publish('resize', 'initial resize');

    }
  }
}]);
