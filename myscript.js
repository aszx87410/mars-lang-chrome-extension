var interval = 5000;
var isEnabled = true;
var timer = null;

// https://github.com/padolsey/findAndReplaceDOMText
function change(){
	for(var key in dict){
		findAndReplaceDOMText(document, {
		  find: new RegExp(key, "g"),
		  replace: dict[key]
		});	
	}
	//console.log('run..');
	setTimeout(change, interval);
}

// 跟 background 互通
function setListener(){

	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	  	
	    isEnabled = request.status;
	    if(window.isFirst==undefined){
	    	window.isFirst = false;
	    }else{

	    	// 剛開始是關閉的，現在要啟動
	    	if(window.firstEnabled===false && isEnabled){
	    		window.firstEnabled = true
	    		change();
	    	}
	    	return;
	    }

	    if(isEnabled){
	    	change();
	    }else{
	    	window.firstEnabled = false;
	    }
  });
}

function init(){
	chrome.runtime.sendMessage({
 		what: 'requestStatus',
	});
}

init();
setListener();

