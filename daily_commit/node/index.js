//first node pro
var http=require("http");
var serv=http.createServer(function(req,res){
	res.writeHead(200,{"Content-type":"text/html"});
	res.end("hello world");


});
 serv.listen(3000);