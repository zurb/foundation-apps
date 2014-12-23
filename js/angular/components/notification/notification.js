(function() {
  'use strict';

  angular.module('foundation.notification', ['foundation.core'])
    .controller('ZfNotificationController', ZfNotificationController)
    .directive('zfNotificationSet', zfNotificationSet)
    .directive('zfNotification', zfNotification)
    .directive('zfNotificationStatic', zfNotificationStatic)
    .directive('zfNotify', zfNotify)
  ;

  ZfNotificationController.$inject = ['$scope', 'FoundationApi'];

  function ZfNotificationController($scope, foundationApi) {
    var controller    = this;
    controller.notifications = $scope.notifications = [];

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
      scope: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      foundationApi.subscribe(attrs.id, function(msg) {
        if(msg === 'clearall') {
          controller.clearAll();
        } else {
          controller.addNotification(msg);
          scope.$apply();
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
        position: '=?',
        color: '=?'
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
        scope.position = scope.position ? scope.position.split(' ').join('-') : 'top-right';
        var animationIn = attrs.animationIn || 'fadeIn';
        var animationOut = attrs.animationOut || 'fadeOut';
        //due to dynamic insertion of DOM, we need to wait for it to show up and get working!
        setTimeout(function() {
          scope.active = true;
          foundationApi.animate(element, scope.active, animationIn, animationOut);
        }, 50);

        scope.remove = function() {
          scope.active = false;
          foundationApi.animate(element, scope.active, animationIn, animationOut);
          setTimeout(function() {
            controller.removeNotification(scope.notifId);
          }, 50);
        };
      }
    }
  }

  zfNotificationStatic.$inject = ['FoundationApi'];

  function zfNotificationStatic(foundationApi) {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/notification/notification.html',
      replace: true,
      transclude: true,
      scope: {
        title: '@?',
        content: '@?',
        image: '@?',
        position: '@?',
        color: '@?'
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
        scope.position = scope.position ? scope.position.split(' ').join('-') : 'top-right';
        var animationIn = attrs.animationIn || 'fadeIn';
        var animationOut = attrs.animationOut || 'fadeOut';


        foundationApi.subscribe(attrs.id, function(msg) {
          if(msg === 'show' || msg === 'open') {
            scope.show();
          } else if (msg === 'close' || msg === 'hide') {
            scope.hide();
          } else if (msg === 'toggle') {
            scope.toggle();
          }

          scope.$apply();

          return;
        });

        scope.hide = function() {
          scope.active = false;
          foundationApi.animate(element, scope.active, animationIn, animationOut);
          return;
        };

        scope.remove = function() {
          scope.hide();
          foundationApi.animate(element, scope.active, animationIn, animationOut);
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
        position: '@?',
        color: '@?',
        image: '@?'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfNotify, {
          title: scope.title,
          content: scope.content,
          position: scope.position,
          color: scope.color,
          image: scope.image
        });
        e.preventDefault();
      });
    }
  }

})();
