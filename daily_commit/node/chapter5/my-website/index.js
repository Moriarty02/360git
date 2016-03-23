var connect = require("connect");
var server = connect.createServer();
server.use(connect.static(__dirname + "/website"));
server.listen(3000);
