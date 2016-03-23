var connect = require("connect");
var time = require("./request-time.js");
var server = connect.createServer();

server.use(connect.logger("dev"));
server.use(time({
    time: 500
}));
//quick res
server.use(function(req, res, next) {
    if ("/a" == req.url) {
        res.writeHead(200);
        res.end("Fast");
    } else {
        next();
    }

});
server.use(function(req, res, next) {
    if ("/b" == req.url) {
        setTimeout(function() {
            res.writeHead(200);
            res.end("Slow");

        }, 1000);
    } else {
        next();
    }

});

server.listen(3000);
