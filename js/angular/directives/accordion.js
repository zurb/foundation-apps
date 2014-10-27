angular.module('foundation.accordion', []);

angular.module('foundation.accordion')
  .controller('FaAccordionController', ['$scope', function($scope) {
    var controller = this;
    var sections = controller.sections = $scope.sections = [];

    controller.select = function(selectSection) {
      angular.forEach(sections, function(section) {
        section.scope.active = false;

        if(section.scope == selectSection) {
          section.scope.active = true;
        }
      });
    };

    controller.addSection = function addsection(sectionScope) {
      sections.push({ scope: sectionScope });

      if(sections.length === 1) {
        sections[0].active = true;
      }
    };

}]);

angular.module('foundation.accordion')
  .directive('faAccordionSet', function() {
  return {
    restrict: 'EA',
    transclude: 'true',
    replace: true,
    templateUrl: '/partials/accordion-set.html',
    controller: 'FaAccordionController',
    link: function(scope, element, attrs, controller) {
    }
  };
});

angular.module('foundation.accordion')
  .directive('faAccordion', function() {
    return {
      restrict: 'EA',
      templateUrl: '/partials/accordion.html',
      transclude: true,
      scope: {
        title: '@'
      },
      require: '^faAccordionSet',
      replace: true,
      controller: function() {},
      link: function(scope, element, attrs, controller, transclude) {
        scope.active = false;
        controller.addSection(scope);

        scope.activate = function() {
          controller.select(scope);
        };

      }
    };
});

