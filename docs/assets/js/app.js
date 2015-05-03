(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'markdown',
    'autocomplete',
    'hljs',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
    .run(track)
    .controller('MotionUIController', MotionUIController)
    .controller('NavController', NavController)
    .controller('AngularModsController', AngularModsController)
    .controller('IconicController', IconicController)
    .controller('ModalController', ModalController)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {

      $urlProvider.otherwise('/');

      $locationProvider.html5Mode({
        enabled:false,
        requireBase: false
      });

      $locationProvider.hashPrefix('!');
  }

  function run() {
      FastClick.attach(document.body);

      var ua = navigator.userAgent;

      if (ua.match(/iP(hone|ad|od)/) && !ua.match(/CriOS/)) {
        if (ua.match(/i(Phone|od)/)) {
          document.body.classList.add('is-iphone');
        }
        else {
          document.body.classList.add('is-ipad');
        }
      }
  }

  track.$inject = ['$rootScope','$window', '$location'];

  function track($rootScope, $window, $location) {
    var track = function() {
      $window.ga('send', 'pageview', { page: $location.path() });
    };
    $rootScope.$on('$locationChangeSuccess', track);
  }
  AngularModsController.$inject = ['$scope', '$state', '$window', 'FoundationApi', 'ModalFactory', 'NotificationFactory'];

  function AngularModsController($scope, $state, $window, FoundationApi, ModalFactory, NotificationFactory) {
    $scope.foo = "Bloop!";
    $scope.bar = "Blee!";

    var modalConfig = {
      id: 'your optional id here',
      template: '{{foo}} {{bar}}',
      contentScope: {
        foo: $scope.foo,
        bar: $scope.bar
      },
      animationIn: 'slideInFromTop'
    }

    $scope.modal = new ModalFactory(modalConfig);

    // instantiate the notification set
    var notifSet = new NotificationFactory({
      position: 'top-right'
    });

    // on some event, call the following
    $scope.addNotification = function() {
      notifSet.addNotification({
        title: "Great success!",
        content: "Congratulations",
        color: 'success'
      });
    }
  };

  MotionUIController.$inject = ['$scope', '$state', '$animate', '$window', 'FoundationApi'];

  function MotionUIController($scope, $state, $animate, $window, FoundationApi) {
    $scope.current = $state.current.name;
    $scope.element = {};
    $scope.speeds = [
      'linear',
      'ease',
      'easeIn',
      'easeOut',
      'easeInOut',
      'bounceIn',
      'bounceOut',
      'bounceInOut'
    ];

    $scope.transitions = [
      {
        direction: 'enter',
        type: 'Slide',
        classes: [
          'slideInDown',
          'slideInUp',
          'slideInLeft',
          'slideInRight'
        ]
      },
      {
        direction: 'leave',
        type: 'Slide',
        classes: [
          'slideOutBottom',
          'slideOutUp',
          'slideOutLeft',
          'slideOutRight'
        ]
      },
      {
        direction: 'enter',
        type: 'Fade',
        classes: [
          'fadeIn'
        ]
      },
      {
        direction: 'leave',
        type: 'Fade',
        classes: [
          'fadeOut'
        ]
      },
      {
        direction: 'enter',
        type: 'Hinge',
        classes: [
          'hingeInFromTop',
          'hingeInFromBottom',
          'hingeInFromRight',
          'hingeInFromLeft',
          'hingeInFromMiddleX',
          'hingeInFromMiddleY'
        ]
      },
      {
        direction: 'leave',
        type: 'Hinge',
        classes: [
          'hingeOutFromTop',
          'hingeOutFromBottom',
          'hingeOutFromRight',
          'hingeOutFromLeft',
          'hingeOutFromMiddleX',
          'hingeOutFromMiddleY'
        ]
      },
      {
        direction: 'enter',
        type: 'Scale',
        classes: [
          'zoomIn'
        ]
      },
      {
        direction: 'leave',
        type: 'Scale',
        classes: [
          'zoomOut'
        ]
      },
      {
        direction: 'enter',
        type: 'Spin',
        classes: [
          'spinIn',
          'spinInCCW'
        ]
      },
      {
        direction: 'leave',
        type: 'Spin',
        classes: [
          'spinOut',
          'spinOutCCW'
        ]
      }
    ];

    $scope.update = function(element) {
      var kitty = angular.element('<img id="kitty" src="http://placekitten.com/g/600/300" />');
      var presentKitty = $window.document.getElementById('kitty');
      var demoElementParent = $window.document.getElementById('demo-card-parent');
      var animationClasses = '';

      for (var prop in $scope.element) {
        if ($scope.element[prop] !== 'default' && $scope.element[prop] !== 'undefined') {
          animationClasses += $scope.element[prop] + ' ';
        }
      }

      kitty.addClass(animationClasses);

      if ($scope.animationFilter === 'enter') {
        if (presentKitty) {
          presentKitty.remove();
        }
        $animate.enter(kitty, demoElementParent).then(function() {
          kitty.removeClass(animationClasses);
        });
      } else {
        $animate.enter(kitty, demoElementParent);
        $animate.leave(kitty);
        if (presentKitty) {
          presentKitty.remove();
        }
      }
    };
  }

  NavController.$inject = ['$scope', '$state'];

  function NavController($scope, $state) {
    $scope.current = $state.current.name;

    var routes = angular.copy(foundationRoutes);

    //setup autocomplete
    $scope.routing = [];
    $scope.typedText = '';

    if(foundationRoutes) {
      angular.forEach(routes, function(r) {
        var title = r.title || r.name.replace('.', ' '); //use title if possible
        $scope.routing.push(title);
      });
    }

    $scope.selectRoute = function(routeName) {
      var title = routeName;
      var name = routeName.replace(' ', '.');

      //search for route
      angular.forEach(routes, function(r) {
        if(r.title && r.title === routeName) {
          $state.go(r.name);
          return;
        } else if (name === r.name) {
          $state.go(r.name);
          return;
        }
      });
    };
  }

  IconicController.$inject = ['$scope', '$timeout'];

  function IconicController($scope, $timeout) {
    var iconNum = 0,
        icons = [{
          icon: 'account',
          iconAttrs: { state: 'login' }
        },{
          icon: 'account',
          iconAttrs: { state: 'logout' }
        },{
          icon: 'chevron',
          iconAttrs: { direction: 'right' }
        },{
          icon: 'chevron',
          iconAttrs: { direction: 'left' }
        }];

    $scope.rotatingIcon = icons[0];
    $scope.staticIcon = icons[0];
    $scope.delayLoadedIcon = null;

    rotateIcon();
    loadIcon();

    function rotateIcon() {
      $timeout(function() {
        if (++iconNum == icons.length) {
          iconNum = 0;
        }
        $scope.rotatingIcon = icons[iconNum];
        rotateIcon();
      }, 3000);
    };

    function loadIcon() {
      $timeout(function() {
        $scope.delayLoadedIcon = icons[0];
      });
    }
  }

  ModalController.$inject = ['$scope', '$timeout', 'ModalFactory'];

  function ModalController($scope, $timeout, ModalFactory) {
    $scope.createModal = function() {
      var modal = new ModalFactory({
        class: 'tiny dialog',
        overlay: true,
        overlayClose: false,
        templateUrl: 'partials/examples-dynamic-modal.html',
        contentScope: {
          close: function() {
            modal.deactivate();
            $timeout(function() {
              modal.destroy();
            }, 1000);
          }
        }
      });
      modal.activate();
    };
  }

})();
