describe('services', function() {
  beforeEach(module('application'));

  describe('prepare route filter', function() {
    it('should exist', inject(function(prepareRouteFilter) {
      expect(prepareRouteFilter).not.toEqual(null);
    }));
  });

  describe('prepare route filter', function() {
    it('should exist', inject(function(prepareRouteFilter) {
      expect(prepareRouteFilter).not.toEqual(null);
    }));

    it('should convert input into a route name', inject(function(prepareRouteFilter) {
      expect(prepareRouteFilter('testing.route')).toBe('route-testing-route');
    }));
  });

  describe('utils factory', function() {
    it('should exist', inject(function(Utils){
      expect(Utils).not.toEqual(null);
    }));

    it('should convert input into a route name', inject(function(Utils) {
      expect(Utils.prepareRoute('testing.route')).toBe('route-testing-route');
    }));
  });
});
