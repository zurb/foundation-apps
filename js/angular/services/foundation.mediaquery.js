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
      var mediaObject;

      helpers.headerHelper(['foundation-mq']);
      extractedMedia = helpers.getStyle('.foundation-mq', 'font-family');

      mediaQueries = helpers.parseStyleToObject((extractedMedia));

      for(var key in mediaQueries) {
        mediaQueries[key] = 'only screen and (min-width: ' + mediaQueries[key].replace('rem', 'em') + ')';
      }


      foundationApi.modifySettings({
        mediaQueries: angular.extend(mediaQueries, namedQueries)
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
        elementQueryResultCache = {};
    
    foundationApi.subscribe('resize', function() {
      // any new resize event causes a clearing of the media cache
      mediaQueryResultCache = {};
    });

    service.getMediaQueries = getMediaQueries;
    service.match = match;
    service.matchesMedia = matchesMedia;
    service.matchesElement = matchesElement;
    service.collectScenariosFromElement = collectScenariosFromElement;

    return service;

    function getMediaQueries() {
      return foundationApi.getSettings().mediaQueries;
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
    
    function matchesElement(element, query) {
      // get width of element
      var elemWidth = element.prop('offsetWidth');
      
      // check if we've run queries against this width before
      if (angular.isUndefined(elementQueryResultCache[elemWidth])) {
        // cache miss, setup cache for width
        elementQueryResultCache[elemWidth] = {};
      }
      
      if (angular.isUndefined(elementQueryResultCache[elemWidth][query])) {
        // cache miss, extract min-width from query and compare to element width
        elementQueryResultCache[elemWidth][query] = elemWidth >= getMinWidthInPxFromQuery(query);
      }
      
      return elementQueryResultCache[elemWidth][query];
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
    
    /** Source adapted from here: https://github.com/marcj/css-element-queries/blob/master/src/ElementQueries.js
     * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
     */
   function getEmSize(element) {
       var fontSize = element.prop('fontSize');
       return parseFloat(fontSize) || 16;
   }
   
   function convertToPx(element, value) {
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
   
   function getMinWidthInPxFromQuery(query) {
     var mediaString = getMediaQueries()[query];
     var matches = mediaString.match(/min-width: ([0-9]+)(em|px|rem|vw|vh|vmin|vmax|)/);
     if (matches && matches.length == 3) {
       // use document element since query is media query against document width
       return convertToPx(angular.element(document.documentElement), matches[1] + matches[2]);
     } else {
       return 0;
     }
   }
  }
})();
