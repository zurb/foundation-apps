var connect = require('connect');
var serveStatic = require('serve-static');
var modRewrite = require('connect-modrewrite');


var app = connect();

app
  .use(modRewrite(['^[^\\.]*$ /index.html [L]']))
  .use(serveStatic('build'))
  .listen('3001');
