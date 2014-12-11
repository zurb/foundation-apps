(function() {
  'use strict';

  angular.module('foundation.accordion', [])
    .controller('ZfAccordionController', zfAccordionController)
    .directive('zfAccordion', zfAccordion)
    .directive('zfAccordionItem', zfAccordionItem)
  ;


  zfAccordionController.$inject = ['$scope'];

  function zfAccordionController($scope) {
    var controller = this;
    var sections = controller.sections = $scope.sections = [];
    var multiOpen = controller.multiOpen = false;
    var autoOpen = controller.autoOpen = $scope.autoOpen = $scope.autoOpen || 'true';

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

      if(sections.length === 1 && autoOpen === 'true') {
        sections[0].active = true;
        sections[0].scope.active = true;
      }
    };

    controller.closeAll = function() {
      sections.forEach(function(section) {
        section.scope.active = false;
      });
    };
  }

  function zfAccordion() {
    var directive = {
      restrict: 'EA',
      transclude: 'true',
      replace: true,
      templateUrl: 'components/accordion/accordion.html',
      controller: 'ZfAccordionController',
      scope: {
        multiOpen: '@?',
        autoOpen: '@?'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      controller.multiOpen = scope.multiOpen === 'true' ? true : false; //parse string into boolean
    }
  }

  //accordion item
  function zfAccordionItem() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'components/accordion/accordion-item.html',
        transclude: true,
        scope: {
          title: '@'
        },
        require: '^zfAccordion',
        replace: true,
        controller: function() {},
        link: link
    };

    return directive;

    function link(scope, element, attrs, controller, transclude) {
      scope.active = false;
      controller.addSection(scope);

      scope.activate = function() {
        controller.select(scope);
      };

    }
  }

})();
