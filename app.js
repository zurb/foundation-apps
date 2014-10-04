var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic('build')).listen('3000');
