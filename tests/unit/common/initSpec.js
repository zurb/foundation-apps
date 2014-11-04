describe('Foundation for Apps Init', function() {
  beforeEach(module('foundation.init'));

  describe('FoundationInit service', function() {
    beforeEach(module('foundation.common.services'));

    it('should exist', inject(function(FoundationInit) {
      expect(FoundationInit).not.toEqual(null);
    }));

  });

});
