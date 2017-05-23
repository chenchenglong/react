// Heroku defines the environment variable PORT, and requires the binding address to be 0.0.0.0
var host = '0.0.0.0';
var port = process.env.PORT || 8081;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
}).listen(port, host, function () {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
