angular.module('foundation.accordion', []);

angular.module('foundation.accordion')
  .controller('FaAccordionController', ['$scope', function($scope) {
    var controller = this;
    var tabs = controller.tabs = $scope.tabs = [];

    controller.select = function(selectTab) {
      angular.forEach(tabs, function(tab) {
        tab.active = false;

        if(tab.scope == selectTab) {
          tab.active = true;
        }
      });
    };

    controller.addTab = function addTab(tabScope) {
      tabs.push({ scope: tabScope });

      if(tabs.length === 1) {
        tabs[0].active = true;
      }
    };

}]);

angular.module('foundation.accordion')
  .directive('faAccordion', function() {
  return {
    restrict: 'EA',
    transclude: 'true',
    replace: true,
    templateUrl: '/partials/accordion.html',
    controller: 'FaAccordionController',
    link: function(scope, element, attrs, controller) {
    }
  };
});

angular.module('foundation.accordion')
  .directive('faAccordionIndividual', function() {
    return {
      restrict: 'EA',
      templateUrl: '/partials/accordion-individual.html',
      transclude: true,
      scope: {
        title: '@'
      },
      require: '^faAccordion',
      controller: function() { },
      replace: true,
      link: function(scope, element, attrs, controller, transclude) {
        scope.active = false;
        console.log(scope.title);
        controller.addTab(scope);

        scope.makeActive = function() {
          controller.select(scope);
        };

      }
    };
});

