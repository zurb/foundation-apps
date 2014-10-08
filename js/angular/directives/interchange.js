angular.module('foundation.interchange', []);

angular.module('foundation.interchange')
  .directive('faInterchange', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    template: '<div ng-transclude></div>',
    transclude: true,
    scope: {
      position: '@'
    },
    replace: true,
    compile: function compile(tElement, tAttrs, transclude) {
      var type = 'interchange';

      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {
          scope.scenarios = [];
          var elements = iElement.children();
          var i = 0;

          //collect
          angular.forEach(elements, function(el) {
            scenario[i] = { media: el.attr('media'), currentStatus: false };
            el.attr('ng-if', 'scenario['+ i + ']');
            i++;
          });
        },
        post: function postLink(scope, element, attrs) {

          var named_queries = {
            'default' : 'only screen',
            small : Foundation.media_queries.small,
            medium : Foundation.media_queries.medium,
            large : Foundation.media_queries.large,
            xlarge : Foundation.media_queries.xlarge,
            xxlarge: Foundation.media_queries.xxlarge,
            landscape : 'only screen and (orientation: landscape)',
            portrait : 'only screen and (orientation: portrait)',
            retina : 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
              'only screen and (min--moz-device-pixel-ratio: 2),' +
              'only screen and (-o-min-device-pixel-ratio: 2/1),' +
              'only screen and (min-device-pixel-ratio: 2),' +
              'only screen and (min-resolution: 192dpi),' +
              'only screen and (min-resolution: 2dppx)'
          };


          //setup
          foundationApi.subscribe('resize', function(msg) {
            var ruleMatches = matched();
            resetScenarios();
            scenarios[ruleMatches[0].ind].currentStatus = true;
            return;
          });

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

          var resetScenarios = function() {
            angular.forEach(scenarios, function(scenario) {
              scenario.currentStatus = false;
            });
          };
        }
      };
    },
  };
}]);

angular.module('foundation.interchange')
  .directive('faSource', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'A',
      templateUrl:  function(tElement, tAttrs) {
        return tAttrs.src || '/partials/interchange-element.html';
      },
      replace: false,
    };
}]);
