angular.module('foundation.accordion', []);

angular.module('foundation.accordion')
  .controller('ZfAccordionController', ['$scope', function($scope) {
    var controller = this;
    var sections = controller.sections = $scope.sections = [];
    var multiOpen = controller.multiOpen = $scope.multiOpen = $scope.multiOpen || false;
    var collapsible = controller.collapsible = $scope.collapsible = $scope.multiOpen || $scope.collapsible || true; //multi open infers a collapsible true
    var autoOpen = controller.autoOpen = $scope.autoOpen = $scope.autoOpen || true; //auto open opens first tab on render

    controller.select = function(selectSection) {
      sections.forEach(function(section) {
        //if multi open is allowed, toggle a tab
        if(controller.multiOpen) {
          if(section.scope === selectSection) {
            section.scope.active = !section.scope.active;
          }
        } else {
          //non  multi open will close all tabs and open one
          section.scope.active = false;
          if(section.scope === selectSection) {
            //if collapsible is allowed, a tab will toggle
            section.scope.active = collapsible === true ? !section.scope.active : true;
          }
        }

      });
    };

    controller.addSection = function addsection(sectionScope) {
      sections.push({ scope: sectionScope });

      if(sections.length === 1 && autoOpen === true) {
        sections[0].active = true;
        sections[0].scope.active = true;
      }
    };

    controller.closeAll = function() {
      sections.forEach(function(section) {
        section.scope.active = false;
      });
    };

}]);

angular.module('foundation.accordion')
  .directive('zfAccordion', function() {
  return {
    restrict: 'EA',
    transclude: 'true',
    replace: true,
    templateUrl: 'partials/accordion.html',
    controller: 'ZfAccordionController',
    scope: {
      multiOpen: '@?',
      collapsible: '@?',
      autoOpen: '@?'
    },
    link: function(scope, element, attrs, controller) {
      scope.multiOpen = controller.multiOpen = scope.multiOpen === "true" ? true : false;
      scope.collapsible = controller.collapsible = scope.collapsible === "true" ? true : false;
      scope.autoOpen = controller.autoOpen = scope.autoOpen === "true" ? true : false;
    }
  };
});

angular.module('foundation.accordion')
  .directive('zfAccordionItem', function() {
    return {
      restrict: 'EA',
      templateUrl: 'partials/accordion-item.html',
      transclude: true,
      scope: {
        title: '@'
      },
      require: '^zfAccordion',
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

