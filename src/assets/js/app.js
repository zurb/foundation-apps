function addClass(id,new_class){
 var i,n=0;

 new_class=new_class.split(",");

 for(i=0;i<new_class.length;i++){
	if((" "+document.getElementById(id).className+" ").indexOf(" "+new_class[i]+" ")==-1){
				 document.getElementById(id).className+=" "+new_class[i];
				 n++;
	}
 }

 return n;
}