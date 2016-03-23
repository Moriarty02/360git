var book=["name","alpha","beta"];
function serveBook(){
	var html="<b>"+book.join("</b><br/><b>")+"</b>"
	book=[];
	return html;
}
console.log(serveBook());
console.log("------------------------------------------------------------------------");
console.log("start");
setTimeout(function(){
	console.log("end");
},5000);
console.log("cut");