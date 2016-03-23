require("colors");
console.log("smashing node".rainbow);
var a = {
    name: "zxh",
    age: "22",
    home: "cq"

}
a.constructor.prototype.text = "demo";
for (var i in a) {

    console.log(i + " :" + a[i]);
}
console.log("---------------------");
var arr = Object.keys(a);
      arr.forEach(function(v) {
    console.log(v);
})
console.log("---------------");
console.log(arr.filter(function(v) {
    if (v.length > 3) {
        return v;
    }

}));
console.log("---------------------");
console.log(arr.map(function(v){
	return v+"2222";
}));