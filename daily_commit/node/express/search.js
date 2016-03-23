var express=require("express");
var app=express.createServer();
app.set("view engine","ejs");
app.set("views",__dirname+"/view");
app.set("view options",{layout:false});
console.log(app.set("views"));

