angular.module('foundation.tabs', []);

angular.module('foundation.tabs')
  .controller('FaTabsController', ['$scope', 'FoundationApi', function FaTabsController($scope, foundationApi) {
    var controller = this;
    var tabs       = controller.tabs = $scope.tabs = [];
    var id         = '';

    controller.select = function(selectTab) {
      tabs.forEach(function(tab) {
        tab.active = false;
        tab.scope.active = false;

        if(tab.scope == selectTab) {
          foundationApi.publish(id, ['activate', tab]);

          tab.active = true;
          tab.scope.active = true;
        }
      });
    };

    controller.addTab = function addTab(tabScope) {
      tabs.push({ scope: tabScope, active: false, parentContent: controller.id });

      if(tabs.length === 1) {
        tabs[0].active = true;
        tabScope.active = true;
      }
    };

    controller.getId = function() {
      return id;
    };

    controller.setId = function(newId) {
      id = newId;
    };
}]);

angular.module('foundation.tabs')
  .directive('faTabs', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    transclude: 'true',
    replace: true,
    templateUrl: '/partials/tabs.html',
    controller: 'FaTabsController',
    scope: {
      displaced: '@?'
    },
    compile: function(tElement, tAttr) {
      return {
        pre: function preLink(scope, element, attrs, controller) {
        },
        post: function postLink(scope, element, attrs, controller) {
          scope.id = attrs.id || foundationApi.generateUuid();
          scope.showTabContent = scope.displaced !== 'true';
          attrs.$set('id', scope.id);
          controller.setId(scope.id);

          //update tabs in case tab-content doesn't have them
          var updateTabs = function() {
            foundationApi.publish(scope.id + '-tabs', scope.tabs);
          };

          foundationApi.subscribe(scope.id + '-get-tabs', function() {
            updateTabs();
          });
        }
      };
    }
  };
}]);

angular.module('foundation.tabs')
  .directive('faTabContent', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    transclude: 'true',
    replace: true,
    scope: {
      tabs: '=?',
      target: '@'
    },
    templateUrl: '/partials/tab-content.html',
    link: function(scope, element, attrs, ctrl) {
      scope.tabs = scope.tabs || [];
      var id = scope.target;

      foundationApi.subscribe(id, function(msg) {
        if(msg[0] == 'activate') {
          var tabId = msg[1];
          scope.tabs.forEach(function (tab) {
            tab.scope.active = false;
            tab.active = false;

            if(tab.scope.id === id) {
              tab.scope.active = true;
              tab.active = true;
            }
          });
        }
      });


      //if tabs empty, request tabs
      if(scope.tabs.length === 0) {
        foundationApi.subscribe(id + '-tabs', function(tabs) {
          scope.tabs = tabs;
        });

        foundationApi.publish(id + '-get-tabs', '');
      }
    }
  };
}]);

angular.module('foundation.tabs')
  .directive('faTab', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'EA',
      templateUrl: '/partials/tab.html',
      transclude: true,
      scope: {
        title: '@'
      },
      require: '^faTabs',
      replace: true,
      link: function(scope, element, attrs, controller, transclude) {
        scope.id = attrs.id || foundationApi.generateUuid();
        scope.active = false;
        scope.transcludeFn = transclude;
        controller.addTab(scope);

        scope.makeActive = function() {
          controller.select(scope);
        };
      }
    };
}]);

angular.module('foundation.tabs')
  .directive('faTabIndividual', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'EA',
      transclude: 'true',
      link: function postLink(scope, element, attrs, ctrl, transclude) {
        var tab = scope.$eval(attrs.tab);
        var id = tab.scope.id;

        tab.scope.transcludeFn(tab.scope, function(tabContent) {
          element.append(tabContent);
        });

        foundationApi.subscribe(tab.scope.id, function(msg) {
          foundationApi.publish(tab.parentContent, ['activate', tab.scope.id]);
        });

      }
    };
}]);

//custom tabs
angular.module('foundation.tabs')
  .directive('faTabHref', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'A',
      replace: false,
      link: function postLink(scope, element, attrs, ctrl) {
        var target = attrs.faTabHref;

        element.on('click', function(e) {
          foundationApi.publish(target, 'activate');
          element.parent().children().removeClass('is-active');
          element.addClass('is-active');
          e.preventDefault();
        });
      }
    };
}]);

angular.module('foundation.tabs')
  .directive('faTabCustom', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'A',
      replace: false,
      link: function(scope, element, attrs, ctrl, transclude) {
        var children = element.children();
        angular.element(children[0]).addClass('is-active');
      }
    };
}]);

angular.module('foundation.tabs')
  .directive('faTabContentCustom', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var tabs = [];
      var children;

      var activateTabs = function(msg, tabId) {
        var tabNodes = element.children();
        angular.forEach(tabNodes, function(node) {
          var el = angular.element(node);
          el.removeClass('is-active');
          if(el.attr('id') === tabId) {
            el.addClass('is-active');
          }

        });
      };

      children.forEach(function(node) {
        if(node.id) {
          var tabId = node.id;
          tabs.push(tabId);
          foundationApi.subscribe(tabId, function(msg) {
            activateTabs(msg, tabId);
          });

          if(tabs.length === 1) {
            var el = angular.element(node);
            el.addClass('is-active');
          }
        }
      });
    }
  };
}]);
