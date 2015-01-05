(function() {
  'use strict';

  angular.module('foundation.core', [])
    .run(mqInitRun)
    .factory('FoundationMQInit', FoundationMQInit)
    .factory('mqHelpers', mqHelpers)
    .service('FoundationApi', FoundationApi)
    .filter('prepareRoute', prepareRoute)
    .factory('Utils', Utils)
  ;

  mqInitRun.$inject = ['FoundationMQInit'];

  function mqInitRun(mqInit) {
    mqInit.init();
  }

  FoundationMQInit.$inject = ['mqHelpers', 'FoundationApi', 'Utils'];

  function FoundationMQInit(helpers, foundationApi, u){
    var factory = {};

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
        mediaQueries: mediaQueries
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


  function FoundationApi() {
    var listeners  = [];
    var settings   = {};
    var uniqueIds  = [];
    var animations = [];
    var service    = {};

    service.subscribe           = subscribe;
    service.publish             = publish;
    service.getSettings         = getSettings;
    service.modifySettings      = modifySettings;
    service.generateUuid        = generateUuid;
    service.toggleAnimation     = toggleAnimation;
    service.closeActiveElements = closeActiveElements;
    service.animate             = animate;

    return service;

    function subscribe(name, callback) {
      if (!listeners[name]) {
        listeners[name] = [];
      }

      listeners[name].push(callback);
      return true;
    }

    function publish(name, msg) {
      if (!listeners[name]) {
        listeners[name] = [];
      }

      listeners[name].forEach(function(cb) {
        cb(msg);
      });

      return;
    }

    function getSettings() {
      return settings;
    }

    function modifySettings(tree) {
      settings = angular.extend(settings, tree);
      return settings;
    }

    function generateUuid() {
      var uuid = '';

      //little trick to produce semi-random IDs
      do {
        uuid += 'zf-uuid-';
        for (var i=0; i<15; i++) {
          uuid += Math.floor(Math.random()*16).toString(16);
        }
      } while(!uniqueIds.indexOf(uuid));

      uniqueIds.push(uuid);
      return uuid;
    }

    function toggleAnimation(element, futureState) {
      var activeClass = 'is-active';
      if(futureState) {
        element.addClass(activeClass);
      } else {
        element.removeClass(activeClass);
      }
    }

    function closeActiveElements(options) {
      var self = this;
      options = options || {};
      var activeElements = document.querySelectorAll('.is-active[zf-closable]');
      if (activeElements.length) {
        angular.forEach(activeElements, function(el) {
          if (options.exclude !== el.id) {
            self.publish(el.id, 'close');
          }
        });
      }
    }

    function animate(element, futureState, animationIn, animationOut) {
      var initClasses        = ['ng-enter', 'ng-leave'];
      var activeClasses      = ['ng-enter-active', 'ng-leave-active'];
      var activeGenericClass = 'is-active';
      var events = ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend',
                'webkitTransitionEnd', 'otransitionend', 'transitionend'];
      var timedOut = true;
      var self = this;
      self.cancelAnimation = cancelAnimation;

      animateElement(futureState ? animationIn : animationOut, futureState);

      function cancelAnimation() {
        deregisterElement(element);
        element.off(events.join(' ')); //kill all animation event handlers
        timedOut = false;
      };

      function registerElement(el) {
        var elObj = {
          el: el,
          animation: self
        };

        //kill in progress animations
        var inProgress = animations.filter(function(obj) {
          return obj.el === el;
        });

        if(inProgress.length > 0) {
          inProgress[0].animation.cancelAnimation();
        }

        animations.push(elObj);
      }

      function deregisterElement(el) {
        var index;
        var currentAnimation = animations.filter(function(obj, ind) {
          if(obj.el === el) {
            index = ind;
          }
        });

        if(index >= 0) {
          animations.splice(index, 1);
        }

      }

      function reflow() {
        return element[0].offsetWidth;
      }

      function reset() {
        element[0].style.transitionDuration = 0;
        element.removeClass(initClasses.join(' ') + ' ' + activeClasses.join(' ') + ' ' + animationIn + ' ' + animationOut);
      }

      function animateElement(animationClass, activation) {
        var initClass = activation ? initClasses[0] : initClasses[1];
        var activeClass = activation ? activeClasses[0] : activeClasses[1];

        var finishAnimation = function() {
          deregisterElement(element);
          reset(); //reset all classes
          element.removeClass(!activation ? activeGenericClass : ''); //if not active, remove active class
          reflow();
          timedOut = false;
        };

        //stop animation
        registerElement(element);
        reset();
        element.addClass(animationClass);
        element.addClass(initClass);
        element.addClass(activeGenericClass);

        //force a "tick"
        reflow();

        //activate
        element[0].style.transitionDuration = '';
        element.addClass(activeClass);

        element.one(events.join(' '), function() {
          finishAnimation();
        });

        setTimeout(function() {
          if(timedOut) {
            finishAnimation();
          }
        }, 3000);
      }

    }
  }

  function prepareRoute() {
    return prepare;

    function prepare(input) {
      return 'route-' + input.replace(/\./, '-').toLowerCase();
    }
  }

  function Utils() {
    var utils = {};

    utils.prepareRoute = prepareRouteUtil;
    utils.throttle = throttleUtil;

    return utils;

    function prepareRouteUtil(input) {
      return 'route-' + input.replace(/\./, '-').toLowerCase();
    }

    function throttleUtil(func, delay) {
      var timer = null;

      return function () {
        var context = this, args = arguments;

        if (timer === null) {
          timer = setTimeout(function () {
            func.apply(context, args);
            timer = null;
          }, delay);
        }
      }
    }
  }

})();
