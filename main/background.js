chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.create({
		url: chrome.runtime.getURL('html/pages/html/settings.html')
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
