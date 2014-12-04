angular.module('foundation.init', ['foundation.common.services']);

angular.module('foundation.init')
  .factory('FoundationInit', ['helpers', 'FoundationApi', 'Utils', function(helpers, foundationApi, u){
    return {
      init: function() {
        var mediaQueries;
        var extractedMedia;
        var mediaObject;

        helpers.headerHelper(['foundation-mq']);
        extractedMedia = helpers.getStyle('.foundation-mq', 'font-family');

        mediaQueries = helpers.processStyleToJSON((extractedMedia));

        for(var key in mediaQueries) {
          mediaQueries[key] = 'only screen and (min-width: ' + mediaQueries[key].replace('rem', 'em') + ')';
        }

        foundationApi.modifySettings({
          media_queries: mediaQueries
        });

        window.addEventListener('resize', u.throttle(function() {
          foundationApi.publish('resize', 'window resized');
        }, 50));

      }
    };
}]);

angular.module('foundation.init')
  .factory('helpers', function() {
    return {

      headerHelper: function(classArray) {
        var i = classArray.length;
        var head = angular.element(document.querySelectorAll('head'));

        while(i--) {
          head.append('<meta class="' + classArray[i] + '" />');
        }

        return;
      },
      getStyle: function(selector, styleName) {
        var elem  = document.querySelectorAll(selector)[0];
        var style = window.getComputedStyle(elem, null);

        return style.getPropertyValue('font-family');
      },
      processStyleToJSON: function(str) {
        var clean = str.slice(1, -1).replace(/\\"/g, '"'); //ready for FF and Chrome

        return JSON.parse(clean);
      }
    };
});

angular.module('foundation.init.state', ['ui.router'])
  .provider('$FoundationState', ['$stateProvider', function($stateProvider) {
    var complexViews = {};

    this.registerDynamicRoutes = function(routes) {
      var dynamicRoutes = routes || foundationRoutes;
      angular.forEach(dynamicRoutes, function(page) {
        if (page.hasComposed === true) {
          if (!angular.isDefined(complexViews[page.parent])) {
            complexViews[page.parent] = { children: {} };
          }

          complexViews[page.parent].children[page.name] = page;
        } else if (page.composed === true) {
          if(!angular.isDefined(complexViews[page.name])) {
            complexViews[page.name] = { children: {} };
          }

          angular.extend(complexViews[page.name], page);
        } else {
          var state = {
            url: page.url,
            templateUrl: page.path,
            parent: page.parent || '',
            controller: page.controller || 'DefaultController',
            data: { vars: page },
          };

          $stateProvider.state(page.name, state);
        }
      });

      angular.forEach(complexViews, function(page) {
          var state = {
            url: page.url,
            parent: page.parent || '',
            data: { vars: page },
            views: { '': {
                templateUrl: page.path,
                controller: page.controller || 'DefaultController',
              }
            }
          };

          angular.forEach(page.children, function(sub) {
            state.views[sub.name + '@' + page.name] = {
              templateUrl: sub.path,
              controller: page.controller || 'DefaultController',
              };
          });

          $stateProvider.state(page.name, state);
      });
    };

    this.$get = function() {
      return {};
    };
}]);
