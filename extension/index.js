// Love Acos(^-^)/

// ---------------- Important TO-DOS ---------------------//

// -------------------------------------------------------//


master();
async function master() {
	sap_data = await storage.loadData();
	log.debug(sap_data);

	// Clean out old, out of date data from users
	storage.removeOldReputation();

	loadPageScript();
}

function loadPageScript() {
	// NOTE: Valid Steam sites should include *all* Steam websites. Keep an eye out for any other official Steamcommunity website!
	const valid_steam_pages = ['https://steamcommunity.com', 'https://store.steampowered.com', 'https://help.steampowered.com'];

	if (!valid_steam_pages.includes(window.location.origin)) return; // This isn't a Steam page. Don't touch anything!

	chrome.runtime.sendMessage({ "icon_path": 'img/sap_good_32.png' });
	const url_parts = window.location.href.split('/');

	if (url_parts[3] === 'tradeoffer') tradeWindow();
	if (!url_parts[5] && ['id', 'profiles'].includes(url_parts[3])) profile();
	if (url_parts[5] === 'edit' && url_parts[6] === 'info') myProfile();
}