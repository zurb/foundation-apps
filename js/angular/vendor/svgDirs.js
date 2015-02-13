'use strict';

(function(){
  var svgDirectives = {};

  angular.forEach([
      'clipPath',
      'colorProfile',
      'src',
      'cursor',
      'fill',
      'filter',
      'marker',
      'markerStart',
      'markerMid',
      'markerEnd',
      'mask',
      'stroke'
    ],
    function(attr) {
      svgDirectives[attr] = [
          '$rootScope',
          '$location',
          '$interpolate',
          '$sniffer',
          'urlResolve',
          'computeSVGAttrValue',
          'svgAttrExpressions',
          function(
              $rootScope,
              $location,
              $interpolate,
              $sniffer,
              urlResolve,
              computeSVGAttrValue,
              svgAttrExpressions) {
            return {
              restrict: 'A',
              link: function(scope, element, attrs) {
                var initialUrl;

                //Only apply to svg elements to avoid unnecessary observing
                //Check that is in html5Mode and that history is supported
                if ((!svgAttrExpressions.SVG_ELEMENT.test(element[0] &&
                    element[0].toString())) ||
                  !$location.$$html5 ||
                  !$sniffer.history) return;

                //Assumes no expressions, since svg is unforgiving of xml violations
                initialUrl = attrs[attr];
                attrs.$observe(attr, updateValue);
                $rootScope.$on('$locationChangeSuccess', updateValue);

                function updateValue () {
                  var newVal = computeSVGAttrValue(initialUrl);
                  //Prevent recursive updating
                  if (newVal && attrs[attr] !== newVal) attrs.$set(attr, newVal);
                }
              }
            };
          }];
  });

  angular.module('ngSVGAttributes', []).
    factory('urlResolve', [function() {
      //Duplicate of urlResolve & urlParsingNode in angular core
      var urlParsingNode = document.createElement('a');
      return function urlResolve(url) {
        urlParsingNode.setAttribute('href', url);
        return urlParsingNode;
      };
    }]).
    value('svgAttrExpressions', {
      FUNC_URI: /^url\((.*)\)$/,
      SVG_ELEMENT: /SVG[a-zA-Z]*Element/,
      HASH_PART: /#.*/
    }).
    factory('computeSVGAttrValue', [
                '$location', '$sniffer', 'svgAttrExpressions', 'urlResolve',
        function($location,   $sniffer,   svgAttrExpressions,   urlResolve) {
          return function computeSVGAttrValue(url) {
            var match, fullUrl;
            if (match = svgAttrExpressions.FUNC_URI.exec(url)) {
              //hash in html5Mode, forces to be relative to current url instead of base
              if (match[1].indexOf('#') === 0) {
                fullUrl = $location.absUrl().
                  replace(svgAttrExpressions.HASH_PART, '') +
                  match[1];
              }
              //Presumably links to external SVG document
              else {
                fullUrl = urlResolve(match[1]);
              }
            }
            return fullUrl ? 'url(' + fullUrl + ')' : null;
          };
        }
      ]
    ).
    directive(svgDirectives);
}());
