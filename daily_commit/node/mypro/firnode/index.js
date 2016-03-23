var fs = require("fs"),
    stdin = process.stdin,
    stdout = process.stdout;

function file(i) {

    var filename = files[i];
    fs.stat(__dirname + "" + filename, function(err, stat) {
        if (stat.isDirectory()) {
            console.log("     " + i + '  \033[36m' + filename + '/\033[39m');
        } else {
            console.log("     " + i + '  \033[90m' + filename + '/\033[39m');

        }

        i++;
        if (i == files.length) {
            read();
        } else {
            file(i);
        }
    });
}

function read() {

    console.log("");
    stdout.write("     \033[33 enter your choice: \033[39m");
    stdin.resume();
    stdin.setEncoding = "utf8";
}
function read(){
	stdin.on("data",option);


}
function option(data){
	if(!files[Number(data)]){
		stdout.write("/033[31m enter your choice: \033[39m");
		stdout.write();
	}else{
		stdin.pause();
	}
}
