// Love Acos(^-^)/

// TODO: Add a filter to the settings page to remove old user data
// TODO: Test profile_scanner.js to make sure if bad data is returned it's handled

master();
async function master() {
	sap_data = await storage.loadData();
	console.log(sap_data);
	log.debug(sap_data);
	loadPageScript();
}

function loadPageScript() {
	const valid_steam_pages = ['https://steamcommunity.com', 'https://store.steampowered.com', 'https://help.steampowered.com'];

	if (!valid_steam_pages.includes(window.location.origin)) return; // This isn't a Steam page. Don't touch anything!

	chrome.runtime.sendMessage({ "icon_path": 'img/sap_good_32.png' });
	const url_parts = window.location.href.split('/');

	if (url_parts[3] === 'tradeoffer') tradeWindow();
	if (!url_parts[5] && ['id', 'profiles'].includes(url_parts[3])) profile();
}