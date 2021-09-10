(async () => {
	storage.generateNewSettings();
	await storage.loadData();
	storage.getNewReferenceData();
})();


chrome.runtime.sendMessage({ "icon_path": 'img/sap_good.png' });