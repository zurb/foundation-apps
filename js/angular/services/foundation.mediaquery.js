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
      var mediaUpMap;
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

      mediaUpMap = {};
      for (key = 0; key < mediaQuerySizes.length; key++) {
        if (key+1 < mediaQuerySizes.length) {
          mediaUpMap[mediaQuerySizes[key].query] = mediaQuerySizes[key+1].query;
        } else {
          mediaUpMap[mediaQuerySizes[key].query] = null;
        }
      }

      foundationApi.modifySettings({
        mediaQueries: angular.extend(mediaQueries, namedQueries),
        mediaUpMap: mediaUpMap
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

      str = str.trim().slice(1, -1); // browsers re-quote string style values

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
    service.getNextMediaUp = getNextMediaUp;
    service.collectScenariosFromElement = collectScenariosFromElement;

    return service;

    function getMediaQueries() {
      return foundationApi.getSettings().mediaQueries;
    }

    function getNextMediaUp(media) {
      return foundationApi.getSettings().mediaUpMap[media];
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
