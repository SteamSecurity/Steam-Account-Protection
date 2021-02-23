// Love Acos(^-^)/

master();
async function master() {
	sap_data = await storage.loadData();
	console.log(sap_data);
	loadPageScript();
	// api.filter.profiles();
}

function loadPageScript() {
	const valid_steam_pages = ['https://steamcommunity.com', 'https://store.steampowered.com', 'https://help.steampowered.com'];

	if (!valid_steam_pages.includes(window.location.origin)) return; // This isn't a Steam page. Don't touch anything!

	chrome.runtime.sendMessage({ "icon_path": 'img/sap_good.png' });
	const url_parts = window.location.href.split('/');

	// Load the actual scripts depending on which page the user is on.
	if (url_parts[3] === 'tradeoffer') trade_window();
	if (!url_parts[5] && ['id', 'profiles'].includes(url_parts[3])) profile();
}