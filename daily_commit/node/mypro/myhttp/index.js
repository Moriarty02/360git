var http = require("http");
var qs = require("querystring");
var server = http.createServer(function(req, res) {
    
    if ("/" == req.url) {
        res.writeHead(200, {
            "Content-type": "text/html"
        });
        res.write(["<form action='/url' method='post'>", "<h1> my form</h1>", " <fieldset><label>persional info</label>", " <p>name?</p>", " <input type='text' name='name'></input>", " <p><button>submit</button></p></fieldset></form>", ].join(""));

    } else if ('/url' == req.url && "POST" == req.method) {
        var body = "";
        req.on("data", function(chunk) {
            body += chunk;
            console.log("body ="+body);
        });
        req.on("end", function() {
            res.writeHead(200, {
                "Content-type": "text/html"
            });
            res.end("name = " + qs.parse(body).name);

        });


    }
}).listen(3000);
