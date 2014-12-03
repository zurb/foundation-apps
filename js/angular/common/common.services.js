angular.module('foundation.common.services', []);

angular.module('foundation.common.services')
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
      animate: function(element, futureState, animationIn, animationOut) {
        var initClasses        = ['ng-enter', 'ng-leave'];
        var activeClasses      = ['ng-enter-active', 'ng-leave-active'];
        var activeGenericClass = 'is-active';
        var events = ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend',
                  'webkitTransitionEnd', 'otransitionend', 'transitionend'];

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
            reset(); //reset all classes
            element.removeClass(!activation ? activeGenericClass : ''); //if not active, remove active class
            reflow();
          });
        };

        animate(futureState ? animationIn : animationOut, futureState);
      }
    };
  }
);

angular.module('foundation.common.services')
  .filter('prepareRoute', function() {
      return function(input) {
        return 'route-' + input.replace(/\./, '-').toLowerCase();
      };
});

angular.module('foundation.common.services')
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
