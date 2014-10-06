angular.module('foundation.modal')
  .directive('faModal', ['FoundationApi', function(foundationApi) {
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

      foundationApi.subscribe('modal', attrs.id, function(msg) {
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
  .directive('faModalClose', ['FoundationApi', function(foundationApi) {
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
        foundationApi.publish('modal', parentModal.attr('id'), 'hide');
        e.preventDefault();
      });
    }
  }
}]);

angular.module('foundation.modal')
  .directive('faModalOpen', ['FoundationApi', function(foundationApi) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish('modal', attrs.faModalOpen, 'show');
        e.preventDefault();
      });
    }
  }
}]);
