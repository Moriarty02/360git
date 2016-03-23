var http=require("http");

var server=http.createServer(function(req,res){
	res.writeHead("200",{"Content-type":"text/html"});
	res.end("<h1>hello world</h1>");

});
server.listen(3000);