 var http = require("http");
 http.createServer(function(req, res) {
     //serve loading
     if ("/" == req.url) {
         res.writeHead(200, {
             "Content-type": "text/html"
         });
         res.end(
             " <form action='/url' method='post'> <input type='text' name='getname'></input><input type='submit'>提交</input></form>";
         );

     } else if ('/url' == req.url && "POST" == req.method) {
     	var body="";
     	req.on("data",function(data){
     		body+=data;
     	});
     	req.on("end",function(){
     		res.writeHead(200,{"Content-type":"text/html"});
     		var resStr=req.headers['content-type'];
     		resStr+="    "+body;
     		res.end(resStr);

     	})；

     }

 }).listen(3000);
