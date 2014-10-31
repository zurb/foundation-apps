angular.module('foundation.init', ['foundation.common.services']);

angular.module('foundation.init')
  .factory('FoundationInit', ['helpers', 'FoundationApi', 'Utils', function(helpers, foundationApi, u){
    return {
      init: function() {
        var mediaQueries = {};
        var mediaClasses = [
          'foundation-mq-small',
          'foundation-mq-medium',
          'foundation-mq-large',
          'foundation-mq-xlarge',
          'foundation-mq-xxlarge',
        ];

        helpers.headerHelper(mediaClasses);


        angular.forEach(mediaClasses, function(mediaClass) {
          var type = mediaClass.split(/-/).pop();
          mediaQueries[type] = helpers.getStyle('.' + mediaClass, 'font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '');
        });

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
          if(head.has('.' + classArray[i]).length === 0) {
            head.append('<meta class="' + classArray[i] + '" />');
          }
        }
        return;
      },
      getStyle: function(selector, styleName) {
        var elem  = document.querySelectorAll(selector)[0];
        var style = window.getComputedStyle(elem, null);

        return style.getPropertyValue('font-family');
      }
    };
});
