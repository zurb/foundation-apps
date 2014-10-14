angular.module('foundation.tabs', []);

angular.module('foundation.tabs')
  .controller('FaTabsController', function FaTabsController() {
    var controller = this;
    var tabs = controller.tabs = [];

    controller.addTab = function addTab(tabScope) {
      tabs.push({ scope: tabScope, active: false });

      if(tabs.length === 1) {
        tabs[tabs.length - 1].active = true;
      }
    };
});

/* Foundation Tabs
 * creates a tabs collection and displays header tabs
 *
 */
angular.module('foundation.tabs')
  .directive('faTabs', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    transclude: 'true',
    replace: true,
    templateUrl: '/partials/tabs.html',
    controller: 'FaTabsController',
    compile: function(tElement, tAttr) {
      if (!tAttr.id) {
        tAtt.$set('id', foundationApi.generateUuid);
      }
      return {
        pre: function preLink(scope, element, attrs) {
        },
        post: function postLink(scope, element, attrs) {

          //update tabs in case tab-content doesn't have them
          var updateTabs = foundationApi.publish(id, tabs);

          foundationApi.subscribe(id + '-get-tabs', function() {
            updateTabs();
          });
        }
      };
    }
  };
}]);

/* uses Tab collection to display tabs and activates them when needed */
angular.module('foundation.tabs')
  .directive('faTabContent', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    transclude: 'true',
    replace: true,
    scope: {
      tabs: '=',
      target: '@'
    },
    templateUrl: 'partials/tab-content.html',
    compile: function(tElement, tAttr) {
      return {
        post: function postLink(scope, element, attrs, ctrl) {
          scope.tabs = scope.tabs || [];
          var id = scope.target;


          foundationApi.subscribe(id + '-tabs-active', function(activeTab) {
            angular.forEach(scope.tabs, function(tab) {
              if(activeTab === tab.id) {
                tab.active = true;
              } else {
                tab.active = false;
              }
            });
          });

          //if tabs empty, request tabs
          if(scope.tabs === []) {
            foundationApi.subscribe(id + '-tabs', function(tabs) {
              scope.tabs = tabs;
            });

            foundationApi.publish(id + '-get-tabs', '');
          }
        }
      };
    }
  };
}]);

angular.module('foundation.tabs')
  .directive('faTab', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'EA',
      require: '^tabs',
      transclude: 'true',
      replace: false,
      scope: {
        title: '@'
      },
      compile: function(tElement, tAttr) {
        if (!tAttr.id) {
          tAtt.$set('id', foundationApi.generateUuid);
        }

        return {
          post: function postLink(scope, element, attrs, controller, transclude) {
            scope.transcludeFn = transclude;
            scope.id = attrs.id;
            controller.addTab(scope);

          }
        };
      }
    };
}]);

angular.module('foundation.tabs')
  .directive('faTabIndividual', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'A',
      transclude: 'true',
      replace: false,
      link: function postLink(scope, element, attrs, ctrl, transclude) {
        var tab = scope.$eval(attrs.tab);

        tab.transcludeFn(tab.scope, function(tabContent) {
          element.append(tabContent);

        });
      }
    };
}]);
