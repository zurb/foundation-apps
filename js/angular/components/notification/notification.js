(function() {
  'use strict';

  angular.module('foundation.notification', ['foundation.core'])
    .controller('ZfNotificationController', ZfNotificationController)
    .directive('zfNotificationSet', zfNotificationSet)
    .directive('zfNotification', zfNotification)
    .directive('zfNotificationStatic', zfNotificationStatic)
    .directive('zfNotify', zfNotify)
    .factory('NotificationFactory', NotificationFactory)
    .service('FoundationNotification', FoundationNotification)
  ;

  FoundationNotification.$inject = ['FoundationApi', 'NotificationFactory'];

  function FoundationNotification(foundationApi, NotificationFactory) {
    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;

    return service;

    //target should be element ID
    function activate(target) {
      foundationApi.publish(target, 'show');
    }

    //target should be element ID
    function deactivate(target) {
      foundationApi.publish(target, 'hide');
    }

    function toggle(target) {
      foundationApi.publish(target, 'toggle');
    }

    function createNotificationSet(config) {
      return new NotificationFactory(config);
    }
  }


  ZfNotificationController.$inject = ['$scope', 'FoundationApi'];

  function ZfNotificationController($scope, foundationApi) {
    var controller    = this;
    controller.notifications = $scope.notifications = $scope.notifications || [];

    controller.addNotification = function(info) {
      var id  = foundationApi.generateUuid();
      info.id = id;
      $scope.notifications.push(info);
    };

    controller.removeNotification = function(id) {
      $scope.notifications.forEach(function(notification) {
        if(notification.id === id) {
          var ind = $scope.notifications.indexOf(notification);
          $scope.notifications.splice(ind, 1);
        }
      });
    };

    controller.clearAll = function() {
      while($scope.notifications.length > 0) {
        $scope.notifications.pop();
      }
    };
  }

  zfNotificationSet.$inject = ['FoundationApi'];

  function zfNotificationSet(foundationApi) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/notification/notification-set.html',
      controller: 'ZfNotificationController',
      replace: true,
      scope: {
        position: '@'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      scope.position = scope.position ? scope.position.split(' ').join('-') : 'top-right';

      foundationApi.subscribe(attrs.id, function(msg) {
        if(msg === 'clearall') {
          controller.clearAll();
        }
        else {
          controller.addNotification(msg);
          if (!scope.$root.$$phase) {
            scope.$apply();
          }
        }
      });
    }
  }

  zfNotification.$inject = ['FoundationApi'];

  function zfNotification(foundationApi) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/notification/notification.html',
      replace: true,
      transclude: true,
      require: '^zfNotificationSet',
      controller: function() { },
      scope: {
        title: '=?',
        content: '=?',
        image: '=?',
        notifId: '=',
        color: '=?',
        autoclose: '=?'
      },
      compile: compile
    };

    return directive;

    function compile() {

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs) {
        iAttrs.$set('zf-closable', 'notification');
      }

      function postLink(scope, element, attrs, controller) {
        scope.active = false;
        var animationIn  = attrs.animationIn || 'fadeIn';
        var animationOut = attrs.animationOut || 'fadeOut';
        var hammerElem;

        //due to dynamic insertion of DOM, we need to wait for it to show up and get working!
        setTimeout(function() {
          scope.active = true;
          foundationApi.animate(element, scope.active, animationIn, animationOut);
        }, 50);

        scope.hide = function() {
          scope.active = false;
          foundationApi.animate(element, scope.active, animationIn, animationOut);
          setTimeout(function() {
            controller.removeNotification(scope.notifId);
          }, 50);
        };

        // close if autoclose
        if (scope.autoclose && scope.active) {
          setTimeout(function() {
            scope.hide();
          }, parseInt(scope.autoclose));
        };

        // close on swipe
        if (Hammer) {
          hammerElem = new Hammer(element[0]);
          // set the options for swipe (to make them a bit more forgiving in detection)
          hammerElem.get('swipe').set({
            direction: Hammer.DIRECTION_ALL,
            threshold: 5, // this is how far the swipe has to travel
            velocity: 0.5 // and this is how fast the swipe must travel
          });
        }

        hammerElem.on('swipe', function() {
          if (scope.active) {
            scope.hide();
          }
        });
      }
    }
  }

  zfNotificationStatic.$inject = ['FoundationApi'];

  function zfNotificationStatic(foundationApi) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/notification/notification-static.html',
      replace: true,
      transclude: true,
      scope: {
        title: '@?',
        content: '@?',
        image: '@?',
        color: '@?',
        autoclose: '@?'
      },
      compile: compile
    };

    return directive;

    function compile() {
      var type = 'notification';

      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs, controller) {
        iAttrs.$set('zf-closable', type);
      }

      function postLink(scope, element, attrs, controller) {
        scope.position = attrs.position ? attrs.position.split(' ').join('-') : 'top-right';

        var animationIn = attrs.animationIn || 'fadeIn';
        var animationOut = attrs.animationOut || 'fadeOut';

        //setup
        foundationApi.subscribe(attrs.id, function(msg) {
          if(msg == 'show' || msg == 'open') {
            scope.show();
            // close if autoclose
            if (scope.autoclose) {
              setTimeout(function() {
                scope.hide();
              }, parseInt(scope.autoclose));
            };
          } else if (msg == 'close' || msg == 'hide') {
            scope.hide();
          } else if (msg == 'toggle') {
            scope.toggle();
            // close if autoclose
            if (scope.autoclose) {
              setTimeout(function() {
                scope.toggle();
              }, parseInt(scope.autoclose));
            };
          }

          foundationApi.animate(element, scope.active, animationIn, animationOut);
          scope.$apply();

          return;
        });

        scope.hide = function() {
          scope.active = false;
          foundationApi.animate(element, scope.active, animationIn, animationOut);
          return;
        };

        scope.show = function() {
          scope.active = true;
          foundationApi.animate(element, scope.active, animationIn, animationOut);
          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
          foundationApi.animate(element, scope.active, animationIn, animationOut);
          return;
        };

      }
    }
  }

  zfNotify.$inject = ['FoundationApi'];

  function zfNotify(foundationApi) {
    var directive = {
      restrict: 'A',
      scope: {
        title: '@?',
        content: '@?',
        color: '@?',
        image: '@?',
        autoclose: '@?'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfNotify, {
          title: scope.title,
          content: scope.content,
          color: scope.color,
          image: scope.image,
          autoclose: scope.autoclose
        });
        e.preventDefault();
      });
    }
  }

  NotificationFactory.$inject = ['$http', '$templateCache', '$rootScope', '$compile', '$timeout', 'FoundationApi'];

  function NotificationFactory($http, $templateCache, $rootScope, $compile, $timeout, foundationApi) {
    return notificationFactory;

    function notificationFactory(config) {
      var self = this, //for prototype functions
          container = angular.element(config.container || document.body),
          id = config.id || foundationApi.generateUuid(),
          attached = false,
          destroyed = false,
          html,
          element,
          scope
      ;

      var props = [
        'position'
      ];

      assembleDirective();

      self.addNotification = addNotification;
      self.clearAll = clearAll;
      self.destroy = destroy;

      return {
        addNotification: addNotification,
        clearAll: clearAll,
        destroy: destroy
      };

      function checkStatus() {
        if(destroyed) {
          throw "Error: Notification Set was destroyed. Delete the object and create a new NotificationFactory instance."
        }
      }

      function addNotification(notification) {
        checkStatus();
        $timeout(function() {
          init(true, notification);
          foundationApi.publish(id, notification);
        }, 0, false);
      }

      function clearAll() {
        checkStatus();
        $timeout(function() {
          foundationApi.publish(id, 'clearall');
        }, 0, false);
      }

      function init(state, notification) {
        if(!attached && html.length > 0) {
          var modalEl = container.append(element);

          scope.notifications = [ notification ];
          $compile(element)(scope);
          attached = true;
        }
      }

      function assembleDirective() {
        html = '<zf-notification-set id="' + id + '"></zf-notification-set>';

        element = angular.element(html);

        scope = $rootScope.$new();

        for(var prop in props) {
          if(config[prop]) {
            element.attr(prop, config[prop]);
          }
        }
      }

      function destroy() {
        self.clearAll();
        setTimeout(function() {
          scope.$destroy();
          element.remove();
          destroyed = true;
        }, 3000);
      }

    }

  }
})();
