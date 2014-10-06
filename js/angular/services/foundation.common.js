angular.module('foundation.common', [])
  .service('FoundationApi', function() {
    var listeners = [];

    return {
      subscribe: function(type, name, callback) {
        listeners[type][name] = callback;
        return true;
      },
      publish: function(type, name, msg) {
        var cb = listeners[type][name] || function() {};
        cb(msg);
        return;
      }
    }
  }
);
