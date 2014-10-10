angular.module('foundation.common.services', []);

angular.module('foundation.common.services')
  .service('FoundationApi', function() {
    var listeners = [];
    var settings = {};

    return {
      subscribe: function(name, callback) {
        if (!listeners[name]) {
          listeners[name] = [];
        }

        listeners[name].push(callback);
        return true;
      },
      publish: function(name, msg) {
        if (!listeners[name]) {
          listeners[name] = [];
        }

        angular.forEach(listeners[name], function(cb) {
          cb(msg)
        });

        return;
      },
      getSettings: function() {
        return settings;
      },
      modifySettings: function(tree) {
        settings = angular.extend(settings, tree);
        return settings;
      }
    }
  }
);
