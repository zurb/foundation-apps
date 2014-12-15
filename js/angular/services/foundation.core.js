(function() {
  'use strict';

  angular.module('foundation.core', []);

  angular.module('foundation.core')
    .run(['FoundationMQInit', function(mqInit) {
      mqInit.init();
  }]);

  angular.module('foundation.core')
    .factory('FoundationMQInit', ['mqHelpers', 'FoundationApi', 'Utils', function(helpers, foundationApi, u){
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

  angular.module('foundation.core')
    .factory('mqHelpers', function() {
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
          if (typeof str !== 'string') return {};
          str = str.trim().slice(1, -1); // browsers re-quote string style values
          if (!str) return {};

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

  angular.module('foundation.core')
    .service('FoundationApi', function() {
      var listeners = [];
      var settings  = {};
      var uniqueIds = [];

      return {
        subscribe: function(name, callback) {
          if (!listeners[name]) {
            listeners[name] = [];
          }

          listeners[name].push(callback);
          return true;
        },
        publish: function(name, msg) {
          if (!listeners[name]) {
            listeners[name] = [];
          }

          listeners[name].forEach(function(cb) {
            cb(msg);
          });

          return;
        },
        getSettings: function() {
          return settings;
        },
        modifySettings: function(tree) {
          settings = angular.extend(settings, tree);
          return settings;
        },
        generateUuid: function() {
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
        },
        toggleAnimation: function(element, futureState) {
          var activeClass = 'is-active';
          if(futureState) {
            element.addClass(activeClass);
          } else {
            element.removeClass(activeClass);
          }
        },
        closeActiveElements: function() {
            var self = this;
            var activeElements = document.querySelectorAll('.is-active[zf-closable]');
            if (activeElements.length) {
              angular.forEach(activeElements, function(el) {
                self.publish(el.id, 'close');
              });
            }
        },
        animate: function(element, futureState, animationIn, animationOut) {
          var initClasses        = ['ng-enter', 'ng-leave'];
          var activeClasses      = ['ng-enter-active', 'ng-leave-active'];
          var activeGenericClass = 'is-active';
          var events = ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend',
                    'webkitTransitionEnd', 'otransitionend', 'transitionend'];
          var timedOut = true;

          var reflow = function() {
            return element[0].offsetWidth;
          };

          var reset = function() {
            element[0].style.transitionDuration = 0;
            element.removeClass(initClasses.join(' ') + ' ' + activeClasses.join(' ') + ' ' + animationIn + ' ' + animationOut);
          };

          var animate = function(animationClass, activation) {
            var initClass = activation ? initClasses[0] : initClasses[1];
            var activeClass = activation ? activeClasses[0] : activeClasses[1];

            var finishAnimation = function() {
              reset(); //reset all classes
              element.removeClass(!activation ? activeGenericClass : ''); //if not active, remove active class
              reflow();
              timedOut = false;
            };

            //stop animation
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
          };

          animate(futureState ? animationIn : animationOut, futureState);
        }
      };
    }
  );

  angular.module('foundation.core')
    .filter('prepareRoute', function() {
        return function(input) {
          return 'route-' + input.replace(/\./, '-').toLowerCase();
        };
  });

  angular.module('foundation.core')
    .factory('Utils', function() {
      return {
        prepareRoute: function(input) {
          return 'route-' + input.replace(/\./, '-').toLowerCase();
        },
        throttle: function (func, delay) {
          var timer = null;

          return function () {
            var context = this, args = arguments;

            if (timer === null) {
              timer = setTimeout(function () {
                func.apply(context, args);
                timer = null;
              }, delay);
            }
          };
        },
      };
  });

})();
