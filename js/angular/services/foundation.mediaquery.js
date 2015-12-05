(function() {
  'use strict';

  angular.module('foundation.mediaquery', ['foundation.core'])
    .run(mqInitRun)
    .factory('FoundationMQInit', FoundationMQInit)
    .factory('mqHelpers', mqHelpers)
    .service('FoundationMQ', FoundationMQ)
  ;

  mqInitRun.$inject = ['FoundationMQInit'];

  function mqInitRun(mqInit) {
    mqInit.init();
  }

  FoundationMQInit.$inject = ['mqHelpers', 'FoundationApi', 'Utils'];

  function FoundationMQInit(helpers, foundationApi, u){
    var factory = {};
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

    factory.init = init;

    return factory;

    function init() {
      var mediaQueries;
      var extractedMedia;
      var mediaQuerySizes;
      var mediaMap;
      var key;

      helpers.headerHelper(['foundation-mq']);
      extractedMedia = helpers.getStyle('.foundation-mq', 'font-family');

      if (!extractedMedia.match(/([\w]+=[\d]+[a-z]*&?)+/)) {
        extractedMedia = 'small=0&medium=40rem&large=75rem&xlarge=90rem&xxlarge=120rem';
      }

      mediaQueries = helpers.parseStyleToObject((extractedMedia));
      mediaQuerySizes = [];

      for(key in mediaQueries) {
        mediaQuerySizes.push({ query: key, size: parseInt(mediaQueries[key].replace('rem', '')) });
        mediaQueries[key] = 'only screen and (min-width: ' + mediaQueries[key].replace('rem', 'em') + ')';
      }

      // sort by increasing size
      mediaQuerySizes.sort(function(a,b) {
        return a.size > b.size ? 1 : (a.size < b.size ? -1 : 0);
      });

      mediaMap = {};
      for (key = 0; key < mediaQuerySizes.length; key++) {
        mediaMap[mediaQuerySizes[key].query] = {
          up: null,
          down: null
        };

        if (key+1 < mediaQuerySizes.length) {
          mediaMap[mediaQuerySizes[key].query].up = mediaQuerySizes[key+1].query;
        }

        if (key !== 0) {
          mediaMap[mediaQuerySizes[key].query].down = mediaQuerySizes[key-1].query;
        }
      }

      foundationApi.modifySettings({
        mediaQueries: angular.extend(mediaQueries, namedQueries),
        mediaMap: mediaMap
      });

      window.addEventListener('resize', u.throttle(function() {
        foundationApi.publish('resize', 'window resized');
      }, 50));
    }
  }


  function mqHelpers() {
    var factory = {};

    factory.headerHelper = headerHelper;
    factory.getStyle = getStyle;
    factory.parseStyleToObject = parseStyleToObject;

    return factory;

    function headerHelper(classArray) {
      var i = classArray.length;
      var head = angular.element(document.querySelectorAll('head'));

      while(i--) {
        head.append('<meta class="' + classArray[i] + '" />');
      }

      return;
    }

    function getStyle(selector, styleName) {
      var elem  = document.querySelectorAll(selector)[0];
      var style = window.getComputedStyle(elem, null);

      return style.getPropertyValue('font-family');
    }

      // https://github.com/sindresorhus/query-string
    function parseStyleToObject(str) {
      var styleObject = {};

      if (typeof str !== 'string') {
        return styleObject;
      }

      if ((str[0] === '"' && str[str.length - 1] === '"') || (str[0] === '\'' && str[str.length - 1] === '\'')) {
        str = str.trim().slice(1, -1); // some browsers re-quote string style values
      }
      
      if (!str) {
        return styleObject;
      }

      styleObject = str.split('&').reduce(function(ret, param) {
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

      return styleObject;
    }
  }

  FoundationMQ.$inject = ['FoundationApi'];

  function FoundationMQ(foundationApi) {
    var service = [],
        mediaQueryResultCache = {},
        queryMinWidthCache = {};

    foundationApi.subscribe('resize', function() {
      // any new resize event causes a clearing of the media cache
      mediaQueryResultCache = {};
    });

    service.getMediaQueries = getMediaQueries;
    service.match = match;
    service.matchesMedia = matchesMedia;
    service.matchesMediaOrSmaller = matchesMediaOrSmaller;
    service.matchesMediaOnly = matchesMediaOnly;
    service.collectScenariosFromElement = collectScenariosFromElement;

    return service;

    function getMediaQueries() {
      return foundationApi.getSettings().mediaQueries;
    }

    function getNextLargestMediaQuery(media) {
      var mediaMapEntry = foundationApi.getSettings().mediaMap[media];
      if (mediaMapEntry) {
        return mediaMapEntry.up;
      } else {
        return null;
      }
    }

    function getNextSmallestMediaQuery(media) {
      var mediaMapEntry = foundationApi.getSettings().mediaMap[media];
      if (mediaMapEntry) {
        return mediaMapEntry.down;
      } else {
        return null;
      }
    }

    function match(scenarios) {
      var count   = scenarios.length;
      var queries = service.getMediaQueries();
      var matches = [];

      if (count > 0) {
        while (count--) {
          var mq;
          var rule = scenarios[count].media;

          if (queries[rule]) {
            mq = matchMedia(queries[rule]);
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

    function matchesMedia(query) {
      if (angular.isUndefined(mediaQueryResultCache[query])) {
        // cache miss, run media query
        mediaQueryResultCache[query] = match([{media: query}]).length > 0;
      }
      return mediaQueryResultCache[query];
    }

    function matchesMediaOrSmaller(query) {
      // In order to match the named breakpoint or smaller,
      // the next largest named breakpoint cannot be matched
      var nextLargestMedia = getNextLargestMediaQuery(query);
      if (nextLargestMedia && matchesMedia(nextLargestMedia)) {
        return false;
      }

      // Check to see if any smaller named breakpoint is matched
      return matchesSmallerRecursive(query);

      function matchesSmallerRecursive(query) {
        var nextSmallestMedia;

        if (matchesMedia(query)) {
          // matches breakpoint
          return true;
        } else {
          // check if matches smaller media
          nextSmallestMedia = getNextSmallestMediaQuery(query);
          if (!nextSmallestMedia) {
            // no more smaller breakpoints
            return false;
          } else {
            return matchesSmallerRecursive(nextSmallestMedia);
          }
        }
      }
    }

    function matchesMediaOnly(query) {
      // Check that media ONLY matches named breakpoint and nothing else
      var nextLargestMedia = getNextLargestMediaQuery(query);

      if (!nextLargestMedia) {
        // reached max media size, run query for current media
        return matchesMedia(query);
      } else {
        // must match named breakpoint, but not next largest
        return matchesMedia(query) && !matchesMedia(nextLargestMedia);
      }
    }

    // Collects a scenario object and templates from element
    function collectScenariosFromElement(parentElement) {
      var scenarios = [];
      var templates = [];

      var elements = parentElement.children();
      var i        = 0;

      angular.forEach(elements, function(el) {
        var elem = angular.element(el);

        //if no source or no html, capture element itself
        if (!elem.attr('src') || !elem.attr('src').match(/.html$/)) {
          templates[i] = elem;
          scenarios[i] = { media: elem.attr('media'), templ: i };
        } else {
          scenarios[i] = { media: elem.attr('media'), src: elem.attr('src') };
        }

        i++;
      });

      return {
        scenarios: scenarios,
        templates: templates
      };
    }
  }
})();
