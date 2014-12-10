angular.module('foundation.tabs', ['foundation.common.services']);

angular.module('foundation.tabs')
  .controller('ZfTabsController', ['$scope', 'FoundationApi', function ZfTabsController($scope, foundationApi) {
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
  .directive('zfTabs', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'EA',
    transclude: 'true',
    replace: true,
    templateUrl: 'partials/tabs.html',
    controller: 'ZfTabsController',
    scope: {
      displaced: '@?'
    },
    link: function(scope, element, attrs, controller) {
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
}]);

angular.module('foundation.tabs')
  .directive('zfTabContent', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    transclude: 'true',
    replace: true,
    scope: {
      tabs: '=?',
      target: '@'
    },
    templateUrl: 'partials/tab-content.html',
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
  .directive('zfTab', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'EA',
      templateUrl: 'partials/tab.html',
      transclude: true,
      scope: {
        title: '@'
      },
      require: '^zfTabs',
      replace: true,
      link: function(scope, element, attrs, controller, transclude) {
        scope.id = attrs.id || foundationApi.generateUuid();
        scope.active = false;
        scope.transcludeFn = transclude;
        controller.addTab(scope);

        foundationApi.subscribe(scope.id, function(msg) {
          if(msg === 'show' || msg === 'open' || msg === 'activate') {
            scope.makeActive();
          }
        });

        scope.makeActive = function() {
          controller.select(scope);
        };
      }
    };
}]);

angular.module('foundation.tabs')
  .directive('zfTabIndividual', ['FoundationApi', function(foundationApi) {
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
          scope.$apply();
        });

      }
    };
}]);

//custom tabs
angular.module('foundation.tabs')
  .directive('zfTabHref', ['FoundationApi', function(foundationApi) {
    return {
      restrict: 'A',
      replace: false,
      link: function postLink(scope, element, attrs, ctrl) {
        var target = attrs.zfTabHref;

        var makeActive = function() {
          element.parent().children().removeClass('is-active');
          element.addClass('is-active');
        };

        foundationApi.subscribe(target, function(msg) {
          if(msg === 'activate' || msg === 'show' || msg === 'open') {
            makeActive();
          }
        });


        element.on('click', function(e) {
          foundationApi.publish(target, 'activate');
          makeActive();
          e.preventDefault();
        });
      }
    };
}]);

angular.module('foundation.tabs')
  .directive('zfTabCustom', ['FoundationApi', function(foundationApi) {
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
  .directive('zfTabContentCustom', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var tabs = [];
      var children = element.children();

      var activateTabs = function(tabId) {
        var tabNodes = element.children();
        angular.forEach(tabNodes, function(node) {
          var el = angular.element(node);
          el.removeClass('is-active');
          if(el.attr('id') === tabId) {
            el.addClass('is-active');
          }

        });
      };

      angular.forEach(children, function(node) {
        if(node.id) {
          var tabId = node.id;
          tabs.push(tabId);
          foundationApi.subscribe(tabId, function(msg) {
            if(msg === 'activate' || msg === 'show' || msg === 'open') {
              activateTabs(tabId);
            }
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
