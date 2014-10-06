angular.module('foundation.common', [])
  .service('FoundationApi', function() {
    var listeners = [];

    return {
      subscribe: function(type, name, callback) {
        if (!listeners[type]) {
          listeners[type] = [];
        }

        listeners[type][name] = callback;
        return true;
      },
      publish: function(type, name, msg) {
        if (!listeners[type]) {
          listeners[type] = [];
        }

        var cb = listeners[type][name] || function() {};
        cb(msg);
        return;
      }
    }
  }
);
