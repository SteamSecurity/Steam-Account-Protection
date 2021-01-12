chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.create({
		url: chrome.runtime.getURL('html/pages/html/index.html')
	});
});

chrome.runtime.onInstalled.addListener(function (details) {
	if (details.reason == 'install') {
		chrome.tabs.create({
			url: chrome.runtime.getURL('html/pages/html/welcome.html')
		});
	}
	if (details.reason == 'update') {

	}
});


chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		chrome.browserAction.setIcon({
			path: request.icon_path,
			tabId: sender.tab.id
		});
	});