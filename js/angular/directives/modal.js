angular.module('foundation.modal', [])
  .directive('modal', function() {
  return {
    restrict: 'A',
    transclude: true,
    templateUrl: '/partials/modal.html',
    scope: {
      title: '=',
      args: '='
    },
    replace: true,
    link: function(scope, element, attrs, ctrl, transcludeFn) {
      var dialog = angular.element(element.children()[0]);
      dialog.addClass('is-active');
      element.addClass('is-active');

      angular.forEach(scope.args, function(value, key) {
        scope[key] = value;
      });

      scope.dismiss = function() {
        dialog.removeClass('is-active');
        element.removeClass('is-active');
      }

      scope.ok = function() {
        dialog.removeClass('is-active');
        element.removeClass('is-active');
      }

      transcludeFn(scope, function (clone)
      {
        dialog.append(clone);
      });
    }
  }
});

