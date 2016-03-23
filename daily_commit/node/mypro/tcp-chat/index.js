var net = require("net");
var count = 0;
var users={};
var server = net.createServer(function(con) {
    /*	console.log('\033[90m   new connection! \033[39m');*/
    con.setEncoding("utf8");
    var nickname="";
    con.write(count+"people here");
    con.on("close", function() {
        count--;
    });
    con.on("data",function(data){
    	data=data.replace('\r\n',"");
    	if(!nickname){
    	con.write( "already in user");
    	return ;
    }else{
    		nickname=data;
    		users[nickname]=conn;
    		for(var  i in users){
    				users[i].write(nickname+"joined the room");
    		}
    }
    });

 count++;
});
server.listen(3000, function() {
    console.log("server listen  on *:3000");

})
