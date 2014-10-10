angular.module('foundation.tabs', []);

angular.module('foundation.tabs')
  .directive('faTabContent', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    template: '<div ng-transclude></div>',
    transclude: true,
    replace: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink(scope, iElement, iAttrs, controller) {
        },
        post: function postLink(scope, element, attrs) {
          var tabs = element.children();
          var currentTab;

          var hide = function(el) {
            el.removeClass('is-active');
            return;
          };

          var show = function(el) {
            el.addClass('is-active');
            return;
          };

          var toggle = function(el) {
            if(currentStatus == 'show') {
              scope.hide();
              currentStatus = 'hide';
              return;
            }

            scope.show();
            currentStatus = 'show';
            return;
          };

          var switchTabControls = function(tabId, msg) {
            foundationApi.publish(tabId + '-control', msg);
          };

          var switchTabs =  function(tabId) {
            angular.forEach(tabs, function(tab) {
                if (tab.attr('id') === tabId) {
                  currentTab = tabId;
                  scope.show(tab);
                  switchTabControls(tabId, 'show');
                } else {
                  scope.hide(tab);
                  switchTabControls(tabId, 'hide');
                }
            });

            return;
          };

          //subscribe all tabs and add class
          angular.forEach(tabs, function(tab) {
            tab.addClass('tab-pane');
            foundationApi.subscribe(tab.attr('id'), switchTabs(msg));
          });
        }
      };
    },
  };
}]);

angular.module('foundation.tabs')
  .directive('fa-tab-href', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller, transclude) {
      var hide = function() {
        element.removeClass('is-active');
        return;
      };

      var show = function() {
        element.addClass('is-active');
        return;
      };

      element.on('click', function(e) {
        //inform tab container about switching tabs
        foundationApi.publish(attrs.faHref, attrs.faHref);
        e.preventDefault();
      });

      foundationApi.subscribe(attrs.faHref + '-control', function(msg) {
        if(msg == 'show' || msg == 'open') {
          scope.show();
        } else if (msg == 'close' || msg == 'hide') {
          scope.hide();
        }

        return;
      });


    }
  };
}]);
