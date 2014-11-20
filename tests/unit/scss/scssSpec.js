describe('Sass', function() {
  describe('node-sass and ruby-sass', inject(function($http) {
    var cssFiles = document.querySelectorAll('link');
    var sass = '';
    var nodeSass = '';
    var interval;

    for(var i = 0; i < cssFiles.length; i++) {
      if(cssFiles[i].href.indexOf('app_node') > -1) {
        nodeSass = cssFiles[i].href;
      } else if(cssFiles[i].href.indexOf('app')) {
        sass = cssFiles[i].href;
      }
    }

    var deep = DeepDiff.noConflict();

    beforeEach(function(done) {
      $http.get(sass).success(function(data) {
        sass = data;
        done();
      });
    });

    beforeEach(function(done) {
      $http.get(nodeSass).success(function(data) {
        nodeSass = data;
        done();
      });
    });

    it('should be equal', function() {
      var differences = diff(nodeSass, sass);

      expect(differences).toEqual({});

    });

  }));
});
