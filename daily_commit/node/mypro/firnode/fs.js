var fs=require("fs");
var stream=fs.createReadStream("my.txt");
stream.on('data',function(content){
	console.log(content);
});
stream.on("end",function(chunk){
	console.log("read finish");
});   
        