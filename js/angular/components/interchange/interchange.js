angular.module('foundation.interchange', ['foundation.services']);

angular.module('foundation.interchange')
  .run(['FoundationInterchangeInit', function(interchangeInit) {
    interchangeInit.init();
}]);

angular.module('foundation.interchange')
  .factory('FoundationInterchangeInit', ['helpers', 'FoundationApi', 'Utils', function(helpers, foundationApi, u){
    return {
      init: function() {
        var mediaQueries;
        var extractedMedia;
        var mediaObject;

        helpers.headerHelper(['foundation-mq']);
        extractedMedia = helpers.getStyle('.foundation-mq', 'font-family');

        mediaQueries = helpers.parseStyleToObject((extractedMedia));

        for(var key in mediaQueries) {
          mediaQueries[key] = 'only screen and (min-width: ' + mediaQueries[key].replace('rem', 'em') + ')';
        }

        foundationApi.modifySettings({
          mediaQueries: mediaQueries
        });

        window.addEventListener('resize', u.throttle(function() {
          foundationApi.publish('resize', 'window resized');
        }, 50));

      }
    };
}]);

angular.module('foundation.interchange')
  .factory('helpers', function() {
    return {

      headerHelper: function(classArray) {
        var i = classArray.length;
        var head = angular.element(document.querySelectorAll('head'));

        while(i--) {
          head.append('<meta class="' + classArray[i] + '" />');
        }

        return;
      },
      getStyle: function(selector, styleName) {
        var elem  = document.querySelectorAll(selector)[0];
        var style = window.getComputedStyle(elem, null);

        return style.getPropertyValue('font-family');
      },
      // https://github.com/sindresorhus/query-string
      parseStyleToObject: function(str) {
        if (typeof str !== 'string') { return {}; }
        str = str.trim().slice(1, -1); // browsers re-quote string style values
        if (!str) { return {}; }

        return str.split('&').reduce(function(ret, param) {
          var parts = param.replace(/\+/g, ' ').split('=');
          var key = parts[0];
          var val = parts[1];
          key = decodeURIComponent(key);

          // missing `=` should be `null`:
          // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
          val = val === undefined ? null : decodeURIComponent(val);

          if (!ret.hasOwnProperty(key)) {
            ret[key] = val;
          } else if (Array.isArray(ret[key])) {
            ret[key].push(val);
          } else {
            ret[key] = [ret[key], val];
          }
          return ret;
        }, {});
      }
    };
});

angular.module('foundation.interchange')
  .directive('zfInterchange', ['FoundationApi', '$compile', '$http', '$templateCache', '$animate',  function(foundationApi, $compile, $http, $templateCache) {
  var templateLoader = function(templateUrl) {
    return $http.get(templateUrl, {cache: $templateCache});
  };

  return {
    restrict: 'EA',
    transclude: 'element',
    scope: {
      position: '@'
    },
    replace: true,
    template: '<div></div>',
    link: function(scope, element, attrs, ctrl, transclude) {
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

      var matched = function() {
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
      };

      var collectInformation = function(parentElement) {
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
      };

      var checkScenario = function(scenario) {
        return !current || current !== scenario;
      };

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
    }
  };
}]);

