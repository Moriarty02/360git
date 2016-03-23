module.exports = function(opts) {
    var time = opts.time || 100;

    return function(req, res, next) {
        var timer = setTimeout(function() {
            console.log("%s %s is taking too long", req.method, req.url);
        }, time);
        var end = res.end();
        res.end == function(chunk, encoding) {
            res.end = end;
            res.end(chunk, encoding);
            clearTimeout(timer);
        };
        next();
    }

}
