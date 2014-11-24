angular.module('foundation.accordion', []);

angular.module('foundation.accordion')
  .controller('ZfAccordionController', ['$scope', function($scope) {
    var controller = this;
    var sections = controller.sections = $scope.sections = [];
    var multiOpen = controller.multiOpen = false;

    controller.select = function(selectSection) {
      sections.forEach(function(section) {
        if(controller.multiOpen) {
          if(section.scope === selectSection) {
            section.scope.active = !section.scope.active;
          }
        } else {
          section.scope.active = false;
          if(section.scope === selectSection) {
            section.scope.active = true;
          }
        }

      });
    };

    controller.addSection = function addsection(sectionScope) {
      sections.push({ scope: sectionScope });

      if(sections.length === 1) {
        sections[0].active = true;
      }
    };

    controller.closeAll = function() {
      sections.forEach(function(section) {
        section.scope.active = false;
      });
    };

}]);

angular.module('foundation.accordion')
  .directive('zfAccordionSet', function() {
  return {
    restrict: 'EA',
    transclude: 'true',
    replace: true,
    templateUrl: '/partials/accordion-set.html',
    controller: 'ZfAccordionController',
    scope: {
      multiOpen: '@'
    },
    link: function(scope, element, attrs, controller) {
      controller.multiOpen = scope.multiOpen;
    }
  };
});

angular.module('foundation.accordion')
  .directive('zfAccordion', function() {
    return {
      restrict: 'EA',
      templateUrl: '/partials/accordion.html',
      transclude: true,
      scope: {
        title: '@'
      },
      require: '^zfAccordionSet',
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

