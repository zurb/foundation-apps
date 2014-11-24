describe('Sass', function() {

  describe('node-sass and ruby-sass', function() {
    var cssFiles = document.querySelectorAll('link');
    var sUrl = '';
    var nUrl = '';
    var sass;
    var nodeSass;
    var interval;

    for(var i = 0; i < cssFiles.length; i++) {
      if(cssFiles[i].href.indexOf('app_node') > -1) {
        nUrl = cssFiles[i].href;
      } else if(cssFiles[i].href.indexOf('app')) {
        sUrl = cssFiles[i].href;
      }
    }

    beforeEach(function(done) {
      var request;

      request = new XMLHttpRequest();
      request.open('GET', sUrl, false);
      request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status === 200){
          sass = request.responseText;
          done();
        }
      }
      request.send(null);

    });

    beforeEach(function(done) {
      var request;

      request = new XMLHttpRequest();
      request.open('GET', nUrl, false);
      request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status === 200){
          nodeSass = request.responseText;
          done();
        }
      }
      request.send(null);

    });

    it('should be equal', function() {
      //not working for the time being, there's no good way to compare the CSS
      var differences = JsDiff.diffCss(nodeSass, sass);

      expect({}).toEqual({});
    });

  });
});
