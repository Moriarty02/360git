var start=Date.now();
setTimeout(function(){
	console.log("start "+(Date.now() - start));
	for(var i =0;i<10000000000;i++){}

},2000);
 setTimeout(function(){
 	console.log("end "+(Date.now() - start));
 },3000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  