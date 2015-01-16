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
          if(section.scope === selectSection) {
            //if collapsible is allowed, a tab will toggle
            section.scope.active = collapsible ? !section.scope.active : true;
          } else {
            section.scope.active = false;
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
        collapsible: '@?',
        autoOpen: '@?'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs, controller) {
      scope.multiOpen = controller.multiOpen = scope.multiOpen === "true" ? true : false;
      scope.collapsible = controller.collapsible = scope.collapsible === "true" ? true : false;
      scope.autoOpen = controller.autoOpen = scope.autoOpen === "true" ? true : false;
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
