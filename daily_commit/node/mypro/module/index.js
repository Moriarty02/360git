var a=require("./a.js");
console.log(a.name);
console.log(a.getPrivate()); 
console.log("------------");
var mybuffrer=new Buffer("==ii1j2i3h1i23h","base64");
console.log(mybuffrer);
require("fs").writeFile("logo.png",mybuffrer);