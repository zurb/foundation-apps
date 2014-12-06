var app = angular.module('application', [
    'ui.router',
    'ngAnimate',
    'markdown',
    'autocomplete',
    'hljs',
    'foundation.init',
    'foundation.init.state',
    'foundation.common.services',
    'foundation.common.directives',
    'foundation.common.animations',
    'foundation.accordion',
    'foundation.actionsheet',
    'foundation.interchange',
    'foundation.modal',
    'foundation.notification',
    'foundation.offcanvas',
    'foundation.panel',
    'foundation.popup',
    'foundation.tabs',
    'foundation.iconic'
  ])
    .config(['$FoundationStateProvider', '$urlRouterProvider', '$locationProvider', function(FoundationStateProvider, $urlProvider, $locationProvider) {

    $urlProvider.otherwise('/');

    FoundationStateProvider.registerDynamicRoutes();

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
}])
  .run(['FoundationInit', '$rootScope', '$state', '$stateParams', function(foundationInit, $rootScope, $state, $stateParams) {
    foundationInit.init();

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}])
  .run(function() {
    FastClick.attach(document.body);
})
  .run(['$rootScope','$window', '$location', function($rootScope, $window, $location) {
    var track = function() {
      $window.ga('send', 'pageview', { page: $location.path() });
    };
    $rootScope.$on('$locationChangeSuccess', track);
  }]);

angular.module('application')
  .controller('MotionUIController', ['$scope', '$state', 'FoundationApi', '$animate', '$window', function($scope, $state, FoundationApi, $animate, $window) {
    $scope.current = $state.current.name;
    $scope.element = {};
    $scope.speeds = [
      "linear",
      "ease",
      "easeIn",
      "easeOut",
      "easeInOut",
      "bounceIn",
      "bounceOut",
      "bounceInOut"
    ];
    $scope.transitions = [
      {
        direction: "enter",
        type: "Slide",
        classes: [
          "slideInDown",
          "slideInUp",
          "slideInLeft",
          "slideInRight"
        ]
      },
      {
        direction: "leave",
        type: "Slide",
        classes: [
          "slideOutBottom",
          "slideOutUp",
          "slideOutLeft",
          "slideOutRight"
        ]
      },
      {
        direction: "enter",
        type: "Fade", 
        classes: [
          "fadeIn"
        ]
      },
      {
        direction: "leave",
        type: "Fade", 
        classes: [
          "fadeOut"
        ]
      },
      {
        direction: "enter",
        type: "Hinge", 
        classes: [
          "hingeInFromTop",
          "hingeInFromBottom",
          "hingeInFromRight",
          "hingeInFromLeft",
          "hingeInFromMiddleX",
          "hingeInFromMiddleY"
        ]
      },
      {
        direction: "leave",
        type: "Hinge", 
        classes: [
          "hingeOutFromTop",
          "hingeOutFromBottom",
          "hingeOutFromRight",
          "hingeOutFromLeft",
          "hingeOutFromMiddleX",
          "hingeOutFromMiddleY"
        ]
      },
      {
        direction: "enter",
        type: "Scale", 
        classes: [
          "zoomIn"
        ]
      },
      {
        direction: "leave",
        type: "Scale", 
        classes: [
          "zoomOut"
        ]
      },
      {
        direction: "enter",
        type: "Spin", 
        classes: [
          "spinIn",
          "spinInCCW"
        ]
      },
      {
        direction: "leave",
        type: "Spin", 
        classes: [
          "spinOut",
          "spinOutCCW"
        ]
      }
    ];

    $scope.update = function(element) {
      var kitty = angular.element('<img id="kitty" src="http://placekitten.com/g/600/300" />');
      var presentKitty = $window.document.getElementById('kitty');
      var demoElementParent = $window.document.getElementById('demo-card-parent');;
      var animationClasses = '';
      for (prop in $scope.element) {
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
      }
      else {
        $animate.enter(kitty, demoElementParent);
        $animate.leave(kitty);
        if (presentKitty) {
          presentKitty.remove();
        }
      }
    };
  }
]);
