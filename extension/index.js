// Love Acos(^-^)/

// NOTE: Valid Steam sites should include *all* Steam websites. Keep an eye out for any other official Steamcommunity website!

// ---------------- Important TO-DOS ---------------------//

// TODO: Organize entire project HTML / CSS into using constant naming conventions. Create common naming conventions for everything. Selected, primary/secondary/tertiary colors
// TODO: Test new profile_scanner file on trading bots and Backpack.tf users
// TODO: Ensure SteamRep returns accurate trade status. Trade banned or not?
// TODO: Instead of refreshing the window, just reload icons when trusting the user

// REVIEW: Add creation date to impersonator overlay? Maybe make setting to allow automatic fetching, disable by default?
// REVIEW: Does the storage filter work correctly?
// REVIEW: Does time work correctly?
// REVIEW: Which icons are we actually using?

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
	const valid_steam_pages = ['https://steamcommunity.com', 'https://store.steampowered.com', 'https://help.steampowered.com'];

	if (!valid_steam_pages.includes(window.location.origin)) return; // This isn't a Steam page. Don't touch anything!

	chrome.runtime.sendMessage({ "icon_path": 'img/sap_good_32.png' });
	const url_parts = window.location.href.split('/');

	console.log(url_parts);

	if (url_parts[3] === 'tradeoffer') tradeWindow();
	if (!url_parts[5] && ['id', 'profiles'].includes(url_parts[3])) profile();
	if (url_parts[5] === 'edit' && url_parts[6] === 'info') myProfile();
}