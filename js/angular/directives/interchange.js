angular.module('foundation.interchange', []);

angular.module('foundation.interchange')
  .directive('faInterchange', ['FoundationApi', '$compile', '$http', '$templateCache' function(foundationApi, $compile, $http, $tempalteCache) {
  var templateLoader = function(templateUrl) {
    return $http.get(templateUrl, {cache: $tempalteCache});
  }

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
        pre: function preLink(scope, iElement, iAttrs, controller, transclude) {
          var scenarios = [];
          var parentElement = iElement;
          var elements = parentElement.children();
          var i = 0;

          console.log(parentElement);
          console.log(elements);

          //collect
          angular.forEach(elements, function(el) {
            var elem = angular.element(el);
            scenarios[i] = { media: elem.attr('media'), src: elem.attr('src') };
            i++;
          });

          console.log(scenarios);

          iElement.html('<div></div>');
          scope.scenarios = scenarios;
        },
        post: function postLink(scope, element, attrs) {
          var named_queries = {
            'default' : 'only screen',
            //small : Foundation.media_queries.small,
            //medium : Foundation.media_queries.medium,
            //large : Foundation.media_queries.large,
            //xlarge : Foundation.media_queries.xlarge,
            //xxlarge: Foundation.media_queries.xxlarge,
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
            var scenario = scenarios[ruleMatches[0].ind];

            var loader = templateLoader(scenario.src);

            loader.success(function(html){
              element.html(html);
            }.then(function(response) {
              element.replaceWith($compile(element.html())(scope));
            }
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
          }
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
      transclude: true,
      replace: false,
      scope: {
        currentStatus: '='
      },
      link: function(scope, element, attr, ctrl, transclude) {
      }
    };
}]);
