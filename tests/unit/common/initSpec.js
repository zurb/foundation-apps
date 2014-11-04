describe('Foundation for Apps Init', function() {
  beforeEach(module('foundation.init'));

  describe('FoundationInit service', function() {
    beforeEach(module('foundation.common.services'));

    it('should exist', inject(function(FoundationInit) {
      expect(FoundationInit).not.toEqual(null);
    }));

    it('should modify global settings with media queries', inject(function(FoundationInit, FoundationApi) {
      expect(FoundationApi.getSettings()).toEqual({});

      FoundationInit.init();

      expect(FoundationApi.getSettings()).toEqual({ media_queries : { small : 'Times New Roman', medium : 'Times New Roman', large : 'Times New Roman', xlarge : 'Times New Roman', xxlarge : 'Times New Roman' } });
    }));
  });

});
