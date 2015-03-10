(function() {
  'use strict';

  angular.module('foundation.modal', ['foundation.core'])
    .directive('zfModal', modalDirective)
    .factory('ModalFactory', ModalFactory)
  ;

  FoundationModal.$inject = ['FoundationApi', 'ModalFactory'];

  function FoundationModal(foundationApi, ModalFactory) {
    var service    = {};

    service.activate = activate;
    service.deactivate = deactivate;
    service.newModal = newModal;

    return service;

    //target should be element ID
    function activate(target) {
      foundationApi.publish(target, 'show');
    }

    //target should be element ID
    function deactivate(target) {
      foundationApi.publish(target, 'hide');
    }

    //new modal has to be controlled via the new instance
    function newModal(config) {
      return new ModalFactory(config);
    }
  }

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
        scope.overlay = attrs.overlay === 'false' ? false : true;
        scope.overlayClose = attrs.overlayClose === 'false' ? false : true;

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

          if (scope.$root && !scope.$root.$$phase) {
            scope.$apply();
          }

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

  ModalFactory.$inject = ['$http', '$templateCache', '$rootScope', '$compile', '$timeout', '$q', 'FoundationApi'];

  function ModalFactory($http, $templateCache, $rootScope, $compile, $timeout, $q, foundationApi) {
    return modalFactory;

    function modalFactory(config) {
      var self = this, //for prototype functions
          container = angular.element(config.container || document.body),
          id = config.id || foundationApi.generateUuid(),
          attached = false,
          destroyed = false,
          html,
          element,
          fetched,
          scope,
          contentScope
      ;

      var props = [
        'animationIn',
        'animationOut',
        'overlay',
        'overlayClose'
      ];

      if(config.templateUrl) {
        //get template
        fetched = $http.get(config.templateUrl, {
          cache: $templateCache
        }).then(function (response) {
          html = response.data;
          assembleDirective();
        });

      } else if(config.template) {
        //use provided template
        fetched = true;
        html = config.template;
        assembleDirective();
      }

      self.activate = activate;
      self.deactivate = deactivate;
      self.toggle = toggle;
      self.destroy = destroy;


      return {
        activate: activate,
        deactivate: deactivate,
        toggle: toggle,
        destroy: destroy
      };

      function checkStatus() {
        if(destroyed) {
          throw "Error: Modal was destroyed. Delete the object and create a new ModalFactory instance."
        }
      }

      function activate() {
        checkStatus();
        $timeout(function() {
          init(true);
          foundationApi.publish(id, 'show');
        }, 0, false);
      }

      function deactivate() {
        checkStatus();
        $timeout(function() {
          init(false);
          foundationApi.publish(id, 'hide');
        }, 0, false);
      }

      function toggle() {
        checkStatus();
        $timeout(function() {
          init(true);
          foundationApi.publish(id, 'toggle');
        }, 0, false);
      }

      function init(state) {
        $q.when(fetched).then(function() {
          if(!attached && html.length > 0) {
            var modalEl = container.append(element);

            scope.active = state;
            $compile(element)(scope);

            attached = true;
          }
        });
      }

      function assembleDirective() {
        // check for duplicate elements to prevent factory from cloning modals
        if (document.getElementById(id)) {
          return;
        }

        html = '<zf-modal id="' + id + '">' + html + '</zf-modal>';

        element = angular.element(html);

        scope = $rootScope.$new();

        // account for directive attributes
        for(var i = 0; i < props.length; i++) {
          var prop = props[i];

          if(config[prop]) {
            switch (prop) {
              case 'animationIn':
                element.attr('animation-in', config[prop]);
                break;
              case 'animationOut':
                element.attr('animation-out', config[prop]);
                break;
              default:
                element.attr(prop, config[prop]);
            }
          }
        }
        // access view scope variables
        if (config.contentScope) {
          contentScope = config.contentScope;
          for (var prop in config.contentScope) {
            if (config.contentScope.hasOwnProperty(prop)) {
              scope[prop] = config.contentScope[prop];
            }
          }
        }
      }

      function destroy() {
        self.deactivate();
        setTimeout(function() {
          scope.$destroy();
          element.remove();
          destroyed = true;
        }, 3000);
        foundationApi.unsubscribe(id);
      }

    }

  }

})();
