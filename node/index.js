var fs = require("fs");
fs.readdir(process.cwd(), function(error, files) {
	//debugger;
    console.log(" ");
    if (!files.length) {
        return console.log("no  files to show");
    }
    console.log("switch file or directory you want to see");

    function file(i) {
        var filename = files[i];

        fs.stat(__dirname + "/" + filename, function(err, stat) {
            if (stat.isDirectory()) {
                console.log(i + "  " + filename);
            } else {
                console.log(i * 2 + "  " + filename);

            }
            i++;
            if (i == files.length) {
                console.log(" ");
                process.stdout.write("enter your choice");
                process.stdin.resume();
            } else {
                file(i);
            }

        });
    }
    file(0);
});
