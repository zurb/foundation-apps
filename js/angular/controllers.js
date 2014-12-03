angular.module('application')
  .controller('DefaultController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
    var params = [];
    angular.forEach($stateParams, function(value, key) {
      params[key] = value;
    });

    $scope.params = params;
    $scope.current = $state.current.name;

    if($state.current.views) {
      $scope.vars = $state.current.data.vars;
      $scope.composed = $state.current.data.vars.children;
    } else {
      $scope.vars = $state.current.data.vars;
    }
  }
]);

angular.module('application')
  .controller('NavController', ['$scope', '$state', function($scope, $state) {
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
]);

angular.module('application')
  .controller('MotionUIController', ['$scope', '$state', 'FoundationApi', '$animate', function($scope, $state, FoundationApi, $animate) {
    $scope.current = $state.current.name;
    $scope.element = {};
    $scope.transitions = [
      {
        direction: "enter",
        type: "Slide",
        classes: [
          "slideInFromTop",
          "slideInFromBottom",
          "slideInFromRight",
          "slideInFromLeft"
        ]
      },
      {
        direction: "leave",
        type: "Slide",
        classes: [
          "slideOutFromTop",
          "slideOutFromBottom",
          "slideOutFromRight",
          "slideOutFromLeft"
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
      var kitty = angular.element('<img id="#demo-card" src="http://placekitten.com/g/600/300" />');
      var demoElementParent = angular.element(document.querySelector('#demo-card-parent'));
      var animationClasses = '';

      for (prop in $scope.element) {
        if ($scope.element[prop] !== 'default' && $scope.element[prop] !== 'undefined') {
          animationClasses += $scope.element[prop] + ' ';
        }
      }
      kitty.addClass(animationClasses);
      if ($scope.animationFilter === 'enter') {
        $scope.animateEnter(kitty, demoElementParent, animationClasses);
      }
      else {
        $animate.enter(kitty, demoElementParent);
        $animate.leave(kitty);
      }
    };

    $scope.animateEnter = function(element, parentElement, classes) {
      $animate.enter(element, parentElement).then(function() {
        element.removeClass(classes);
        $animate.leave(element);
      });
    };
  }
]);

