var enabledIcon = "icon-green.png";
var disabledIcon = "icon.png";
var globalIsEnabled = true;

function setStatus(isEnabled){
	chrome.storage.sync.set({'status': isEnabled}, function(a) {
		setIcon(isEnabled);
	});
}

function init(){
	//alert('init!');
	chrome.storage.sync.get('status', function(items){
		if(items['status']==undefined){
			globalIsEnabled = true;
		}else{
			globalIsEnabled = items['status'];
		}
		setIcon(globalIsEnabled);
    });

    // 監聽 icon 點擊
	chrome.browserAction.onClicked.addListener(function(tab){
		globalIsEnabled = !globalIsEnabled;
		setStatus(globalIsEnabled);
	});

	// 監聽event
	chrome.runtime.onMessage.addListener(function (msg, sender) {
		if(msg.what=='requestStatus'){
			sendMessage({
				status: globalIsEnabled
			});
		}
	});
}

function setIcon(isEnabled){
	chrome.browserAction.setIcon({
		path: isEnabled?enabledIcon:disabledIcon
	}, null)

	sendMessage({
		status: isEnabled
	});
}

function sendMessage(msg){
	chrome.tabs.query({active: true}, function(tabs){
		for(var i=0;i<tabs.length;i++){
			chrome.tabs.sendMessage(tabs[i].id, msg, null);  
		}
	});
}

init();

