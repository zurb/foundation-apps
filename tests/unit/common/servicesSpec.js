describe('Common Foundation Services', function() {
  beforeEach(module('foundation.common.services'));

  it('should exist', inject(function(FoundationApi) {
    expect(FoundationApi).not.toEqual(null);
  }));


});
