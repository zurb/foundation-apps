(function() {
  'use strict';

  angular.module('foundation.modal', ['foundation.core'])
    .directive('zfModal', modalDirective)
    .service('ModalFactory', ModalFactory)
  ;


  modalDirective.$inject = ['FoundationApi'];

  function modalDirective(foundationApi) {

    var directive = {
      restrict: 'EA',
      templateUrl: 'components/modal/modal.html',
      transclude: true,
      scope: true,
      replace: true,
      compile: compile
    };

    return directive;

    function compile(tElement, tAttrs, transclude) {
      var type = 'modal';

      return {
        pre: preLink,
        post: postLink
      }

      function preLink(scope, iElement, iAttrs, controller) {
          iAttrs.$set('zf-closable', type);
      }

      function postLink(scope, element, attrs) {
        var dialog = angular.element(element.children()[0]);

        scope.active = false;
        scope.overlay = attrs.overlay === 'true' || attrs.overlayClose === 'true' ? true : false;
        scope.overlayClose = attrs.overlayClose === 'true' ? true : false;

        var animationIn = attrs.animationIn || 'fadeIn';
        var animationOut = attrs.animationOut || 'fadeOut';
        var overlayIn = 'fadeIn';
        var overlayOut = 'fadeOut';

        //setup
        foundationApi.subscribe(attrs.id, function(msg) {
          if(msg === 'show' || msg === 'open') {
            scope.show();
          } else if (msg === 'close' || msg === 'hide') {
            scope.hide();
          } else if (msg === 'toggle') {
            scope.toggle();
          }

          scope.$apply();

          return;
        });

        scope.hideOverlay = function() {
          if(scope.overlayClose) {
            scope.hide();
          }
        };

        scope.hide = function() {
          scope.active = false;
          animate();
          return;
        };

        scope.show = function() {
          scope.active = true;
          animate();
          dialog.tabIndex = -1;
          dialog[0].focus();
          return;
        };

        scope.toggle = function() {
          scope.active = !scope.active;
          animate();
          return;
        };

        function animate() {
          //animate both overlay and dialog
          if(!scope.overlay) {
            element.css('background', 'transparent');
          }

          foundationApi.animate(element, scope.active, overlayIn, overlayOut);
          foundationApi.animate(dialog, scope.active, animationIn, animationOut);
        }
      }
    }
  }

  ModalFactory.$inject = ['$http', '$templateCache', '$rootScope', '$compile',  'FoundationApi'];

  function ModalFactory($http, $templateCache, $rootScope, $compile, foundationApi) {
    return modalFactory;

    function modalFactory(config) {
      var self = this, //for prototype functions
          container = angular.element(config.container || document.body),
          id = config.id || foundationApi.generateUuid(),
          attached = false,
          overlay = config.overlay || false,
          overlayClose = config.overlayClose || false,
          animationIn = config.animationIn || 'fadeIn',
          animationOut = config.animationOut || 'fadeOut',
          html,
          element,
          scope
      ;

      self.activate = activate;
      self.deactivate = deactivate;
      self.toggle = toggle;

      if(config.templateUrl) {
        //get template
        html = $http.get(config.templateUrl, {
          cache: $templateCache
        }).then(function (response) {
          return response.data;
        });

      } else if(config.template) {
        //use provided template
        html = config.template;
      }

      function activate() {
        attach();

        foundationApi.publish(id, 'show');
      }

      function deactivate() {
        foundationApi.publish(id, 'hide');
      }

      function toggle() {
        attach();

        foundationApi.publish(id, 'toggle');
      }

      function attach() {
        if(!attached) {
          compileDirective();
          container.append(element);
        }
      }

      function compileDirective() {
        var openHtml = [
          '<zf-modal',
            'id="' + id + '"',
            'overlay="' + overlay + '"',
            'overlay-close="' + overlayClose + '"',
            'animation-in="' + animationIn + '"',
            'animation-out="' + animationOut + '"',
          '>'
        ];

        var closeHtml = [ '</zf-modal>' ];

        html = openHtml.join(' ') + html + closeHtml.join(' ');

        element = angular.element(html);

        scope = $rootScope.$new();

        $compile(element)(scope);
      }

    }

  }

})();
