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
      };

      function preLink(scope, iElement, iAttrs, controller) {
          iAttrs.$set('zf-closable', type);
      }

      function postLink(scope, element, attrs) {
        var dialog = angular.element(element.children()[0]);

        scope.active = scope.active || false;
        scope.overlay = attrs.overlay === 'true' || attrs.overlayClose === 'true' ? true : false;
        scope.overlayClose = attrs.overlayClose === 'true' ? true : false;

        var animationIn = attrs.animationIn || 'fadeIn';
        var animationOut = attrs.animationOut || 'fadeOut';
        var overlayIn = 'fadeIn';
        var overlayOut = 'fadeOut';

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

        init();

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

        function animate() {
          //animate both overlay and dialog
          if(!scope.overlay) {
            element.css('background', 'transparent');
          }

          foundationApi.animate(element, scope.active, overlayIn, overlayOut);
          foundationApi.animate(dialog, scope.active, animationIn, animationOut);
        }

        function init() {
          if(scope.active) {
            scope.show();
          }
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
          html,
          element,
          scope
      ;

      var props = [
        'animationIn',
        'animationOut',
        'overlay',
        'overlayClose'
      ];

      if(config.templateUrl) {
        //get template
        $http.get(config.templateUrl, {
          cache: $templateCache
        }).then(function (response) {
          html = response.data;
          assembleDirective();
        });

      } else if(config.template) {
        //use provided template
        html = config.template;
        assembleDirective();
      }

      self.activate = activate;
      self.deactivate = deactivate;
      self.toggle = toggle;


      return {
        activate: activate,
        deactivate: deactivate,
        toggle: toggle
      };

      function activate() {
        scope.$$postDigest(function() {
          init(true);
          foundationApi.publish(id, 'show');
        });
      }

      function deactivate() {
        scope.$$postDigest(function() {
          init(false);
          foundationApi.publish(id, 'hide');
        });
      }

      function toggle() {
        scope.$$postDigest(function() {
          init(true);
          foundationApi.publish(id, 'toggle');
        });
      }

      function init(state) {
        if(!attached && html.length > 0) {
          var directive = angular.element(html);
          var modalEl = container.append(directive);
          scope.active = state;
          $compile(directive)(scope);
          attached = true;
        }
      }

      function assembleDirective() {
        html = '<zf-modal id="' + id + '">' + html + '</zf-modal>';

        scope = $rootScope.$new();

        for(var prop in props) {
          scope[prop] = config[prop];
        }
      }

    }

  }

})();
