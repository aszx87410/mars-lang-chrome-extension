var isEnabled = true;

function change(node){
  var key;
  var p = node;
  while( p && p!=document.body ){
    if( p.isContentEditable )
      return;
    p = p.parentNode;
  }
  if( node.nodeName === '#text' ){
    for(key in dict)
      node.data = node.data.replace(new RegExp(key, 'g'), dict[key]);
  }
  else{
    for(key in dict){
      findAndReplaceDOMText(node, {
        find: new RegExp(key, "g"),
        replace: dict[key]
      });
    }
  }
}

// https://github.com/padolsey/findAndReplaceDOMText
function each(arr, act){
  var i;
  for(i=0; i<arr.length; ++i)
    act(arr[i]);
}

var observer = new MutationObserver(function(mutations){
  each(mutations, function(mutation){
    each(mutation.addedNodes, change);
  });
});

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
	    		change(document.body);
                        observer.observe(document.body, {childList:true, subtree:true});
	    	}
	    	return;
	    }

	    if(isEnabled){
	    	change(document.body);
                observer.observe(document.body, {childList:true, subtree:true});
	    }else{
	    	window.firstEnabled = false;
                observer.disconnect();
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

