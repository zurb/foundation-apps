angular.module('foundation.common', [])
  .service('FoundationApi', function() {
    var listeners = [];

    return {
      subscribe: function(type, name, callback) {
        if (!listeners[type]) {
          listeners[type] = [];
        }

        if (!listeners[type][name]) {
          listeners[type][name] = [];
        }

        listeners[type][name].push(callback);
        return true;
      },
      publish: function(type, name, msg) {
        if (!listeners[type]) {
          listeners[type] = [];
        }

        if (!listeners[type][name]) {
          listeners[type][name] = [];
        }

        angular.forEach(listeners[type][name], function(cb) {
          cb(msg)
        });

        return;
      }
    }
  }
);
