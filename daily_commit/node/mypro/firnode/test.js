function file(i){
	var filename=files[i];
	fs.stat(__dirname+""+filename,function(err,stat){
		if(stat.isDirectory()){
			console.log(i+"  "+filename+"   dir");

		}else{
			console.log(i+" "+filename);
		}
		if(++i==files.length){
			read();
		}else{
			file(i);
		}

	});

}
function read(){
	console.log(" ");
	stdout.write(" enter your choice 1");
	stdin.resume();
	stdin.setEncoding("utf8");

}
function read(){
	stdin.on("data",option);
}
function option(){
	 if(!files[Number(data)]){
	 	stdout.write(" enter your choice 2");
	 }else{
	 	stdin.pause();
	 }
}
function option(data){
	var filename=files[i];
	if(!filename){
		stdout.write("enter your choice 3");
	}else{
		stdin.pause();
		fs.readFile(__dirname+""+filename,"utf8",function(err ,data){
			console.log("");
			console.log(data.replace(/(.*)/g,'     $1'));

		});
	}
}