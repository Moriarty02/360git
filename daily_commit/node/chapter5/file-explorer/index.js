var http = require("http");
var fs = require("fs");

/**
 * create a server
 */
var server = http.createServer(function(req, res) {
    /* if ("GET" == req.method && "/images/" == req.url.substr(0, 7) && ".png" == req.url.substr(-4)) {
         //---
         if (fs.stat(__dirname + req.url, function(err, stat))){

                 if (err || !stat.isFile()) {
                     res.writeHead("404");
                     res.end("Not FOUND");
                     return;
                 }
                 serve(__dirname + req.url, "application/png");
             }

     } else if ("GET" == req.method && "" == req.url) {
         serve(__dirname + "/index.html", "text/html");
     } else {
         res.writeHead(404);
         res.end("Not found");
     }*/

    if ("GET" == req.method && "/images" == req.url.substr(0, 7) && ".png" == req.url.substr(-4)) {
    	
        fs.stat(__dirname + req.url, function(error, stat) {
            if (error || !stat.isFile()) {
                res.writeHead(404);
                res.end("not found");
                return;
            }
            serve(__dirname + req.url, "application/png");

        });

    } else if ("GET" == req.method && "/" == req.url) {
        serve(__dirname + "/index.html", "text/html");
    } else {

        res.writeHead(404);
        res.end("not found2");
    }

    function serve(path, type) {
        res.writeHead(200, {
            "Content-type": type
        });
        /*
            fs.creatReadStream(path).on("data", function(data) {
                res.write(data);
            }).on("end", function() {
                res.end();
            });*/
        fs.createReadStream(path).pipe(res);
    }
});



/**
 * listen
 */
server.listen(3000);
