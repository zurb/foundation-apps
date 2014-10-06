angular.module('foundation.modal', [])
  .service('FoundationModalApi', function() {
    var listeners = [];
    return {
      subscribe: function(name, callback) {
        listeners[name] = callback;
        return true;
      },
      publish: function(name, msg) {
        var cb = listeners[name] || function() {};
        cb(msg);
        return;
      }


    }
  }
);

angular.module('foundation.modal')
  .directive('faModal', ['FoundationModalApi', function(modalApi) {
  return {
    restrict: 'A',
    templateUrl: '/partials/modal.html',
    transclude: true,
    scope: {
      src: '@'
    },
    replace: true,
    link: function(scope, element, attrs) {
      var dialog = angular.element(element.children()[0]);

      var modalStatus = 'hide';

      modalApi.subscribe(attrs.id, function(msg) {
        if(msg == 'show') {
          scope.show();
        } else if (msg == 'hide') {
          scope.hide();
        } else if (msg == 'toggle') {
          scope.toggle();
        }

        return;
      });

      scope.hide = function() {
        dialog.removeClass('is-active');
        element.removeClass('is-active');
        modalStatus = 'hide';
        return;
      }

      scope.show = function() {
        dialog.addClass('is-active');
        element.addClass('is-active');
        modalStatus = 'show';
        return;
      }

      scope.toggle = function() {
        if(modalStatus == 'show') {
          scope.hide();
          modalStatus = 'hide';
          return;
        }

        scope.show();
        modalStatus = 'show';
        return;
      }
    }
  }
}]);

angular.module('foundation.modal')
  .directive('faModalClose', ['FoundationModalApi', function(modalApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var parentModal = false;
      var tempModal = element.parent();

      //find parent modal
      while(parentModal == false) {
        if(tempModal[0].nodeName == 'BODY') {
          parentModal = '';
        }

        if(typeof tempModal.attr('fa-modal') !== 'undefined' && tempModal.attr('fa-modal') !== false) {
          parentModal = tempModal;
        }

        tempModal = tempModal.parent();
      }

      element.on('click', function(e) {
        modalApi.publish(parentModal.attr('id'), 'hide');
        e.preventDefault();
      });
    }
  }
}]);

angular.module('foundation.modal')
  .directive('faModalOpen', ['FoundationModalApi', function(modalApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        modalApi.publish(attrs.faModalOpen, 'show');
        e.preventDefault();
      });
    }
  }
}]);
