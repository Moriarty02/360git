var fs = require("fs");
fs.readFile("error.js", function(error, content) {
    if (!error) console.log(content);
})
