describe('PageController', function() {
  var scope;
  var pageController;

  beforeEach(inject(function($injector) {
    var $controller = $injector. get('$controller');
    scope = $injector.get('$rootScope');

    pageController = $controller('pageController', {
      $scope: scope
    });

  }));

  it('should work', function() {

  });


});
