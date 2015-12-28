(function() {
  'use strict';

  angular.module('foundation.common', ['foundation.core'])
    .directive('zfClose', zfClose)
    .directive('zfOpen', zfOpen)
    .directive('zfToggle', zfToggle)
    .directive('zfEscClose', zfEscClose)
    .directive('zfSwipeClose', zfSwipeClose)
    .directive('zfHardToggle', zfHardToggle)
    .directive('zfCloseAll', zfCloseAll)
  ;

  zfClose.$inject = ['FoundationApi'];

  function zfClose(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var targetId = '';
      if (attrs.zfClose) {
        targetId = attrs.zfClose;
      } else {
        var parentElement= false;
        var tempElement = element.parent();
        //find parent modal
        while(parentElement === false) {
          if(tempElement[0].nodeName == 'BODY') {
            parentElement = '';
          }

          if(typeof tempElement.attr('zf-closable') !== 'undefined' && tempElement.attr('zf-closable') !== false) {
            parentElement = tempElement;
          }

          tempElement = tempElement.parent();
        }
        targetId = parentElement.attr('id');
      }
      element.on('click', function(e) {
        foundationApi.publish(targetId, 'close');
        e.preventDefault();
      });
    }
  }

  zfOpen.$inject = ['FoundationApi'];

  function zfOpen(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfOpen, 'open');
        e.preventDefault();
      });
    }
  }

  zfToggle.$inject = ['FoundationApi'];

  function zfToggle(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    }

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.publish(attrs.zfToggle, 'toggle');
        e.preventDefault();
      });
    }
  }

  zfEscClose.$inject = ['FoundationApi'];

  function zfEscClose(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('keyup', function(e) {
        if (e.keyCode === 27) {
          foundationApi.closeActiveElements();
        }
        e.preventDefault();
      });
    }
  }

  zfSwipeClose.$inject = ['FoundationApi'];

  function zfSwipeClose(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;

    function link($scope, element, attrs) {
      var swipeDirection;
      var hammerElem;
      if (typeof(Hammer)!=='undefined') {
        hammerElem = new Hammer(element[0]);
        // set the options for swipe (to make them a bit more forgiving in detection)
        hammerElem.get('swipe').set({
          direction: Hammer.DIRECTION_ALL,
          threshold: 5, // this is how far the swipe has to travel
          velocity: 0.5 // and this is how fast the swipe must travel
        });
      }
      // detect what direction the directive is pointing
      switch (attrs.zfSwipeClose) {
        case 'right':
          swipeDirection = 'swiperight';
          break;
        case 'left':
          swipeDirection = 'swipeleft';
          break;
        case 'up':
          swipeDirection = 'swipeup';
          break;
        case 'down':
          swipeDirection = 'swipedown';
          break;
        default:
          swipeDirection = 'swipe';
      }
      if(typeof(hammerElem) !== 'undefined'){
        hammerElem.on(swipeDirection, function() {
          foundationApi.publish(attrs.id, 'close');
        });
      }
    }
  }

  zfHardToggle.$inject = ['FoundationApi'];

  function zfHardToggle(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        foundationApi.closeActiveElements({exclude: attrs.zfHardToggle});
        foundationApi.publish(attrs.zfHardToggle, 'toggle');
        e.preventDefault();
      });
    }
  }

  zfCloseAll.$inject = ['FoundationApi'];

  function zfCloseAll(foundationApi) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('click', function(e) {
        var tar = e.target;
        var avoidAttrs = ['zf-toggle', 'zf-hard-toggle', 'zf-open', 'zf-close'].filter(function(e, i){
          return e in tar.attributes;
        });
        var avoidClasses, avoidNodes;

        if(avoidAttrs.length > 0){ return; }

        // check if clicked element is inside active closable parent
        if (getParentsUntil(tar, 'zf-closable', 'is-active') !== false) {
          // do nothing
          return;
        }

        // close all active elements
        var activeElements = document.querySelectorAll('.is-active[zf-closable]');
        if(activeElements.length > 0) {
          for(var i = 0; i < activeElements.length; i++) {
            if (!activeElements[i].hasAttribute('zf-ignore-all-close')) {
              foundationApi.publish(activeElements[i].id, 'close');
            }
          }
        }

        avoidAttrs = ['ui-sref', 'href'].filter(function(attr, i){
          return getParentsUntil(tar, attr) !== false;
        });

        if(avoidAttrs.length == 0) {
          // check for classes to avoid
          avoidClasses = ['switch'].filter(function(klass, i){
            return getParentsUntil(tar, false, klass) !== false;
          });

         if(avoidClasses.length == 0) {
           // check for nodes to avoid
           avoidNodes = ['input'].filter(function(node, i){
             return getParentsUntil(tar, false, false, node) !== false;
           });

          if(avoidNodes.length == 0) {
             // prevent default if target not inside parent with
             // avoided attribute, class, or node
             e.preventDefault();
           }
          }
        }
      });
    }
    /** special thanks to Chris Ferdinandi for this solution.
     * http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
     */
    function getParentsUntil(elem, attrCheck, classCheck, nodeCheck) {
      for ( ; elem && elem !== document.body; elem = elem.parentNode ) {
        if (nodeCheck && elem.nodeName == nodeCheck) {
          return elem;
        }
        if (attrCheck) {
          if (elem.hasAttribute(attrCheck)) {
            if(!classCheck || elem.classList.contains(classCheck)) { return elem; }
            break;
          }
        } else {
          if(!classCheck || elem.classList.contains(classCheck)) { return elem; }
        }
      }
      return false;
    }
  }
})();
