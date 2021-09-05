// Love Acos(^-^)/

// NOTE: Valid Steam sites should include *all* Steam websites. Keep an eye out for any other official Steamcommunity website!

// ---------------- Important TO-DOS ---------------------//

// TODO: Test new profile_scanner file on trading bots and Backpack.tf users
// TODO: Ensure SteamRep returns accurate trade status. Trade banned or not?
// TODO: Test profile_scanner.js to make sure if bad data is returned it's handled.
// TODO: Change username colors on trade windows to reflect status.
// TODO: Inject reputation status into trade toolbar.

// REVIEW: Add creation date to impersonator overlay? Maybe make setting to allow automatic fetching, disable by default?
// REVIEW: Does the storage filter work correctly?
// REVIEW: Does time work correctly?
// REVIEW: Which icons are we actually using?

// FIXME: Developer anon settings are insufficient. 
// FIXME: Overlays have habit of showing themselves to fit the whole browser. That's ugly, fix it!

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

	if (url_parts[3] === 'tradeoffer') tradeWindow();
	if (!url_parts[5] && ['id', 'profiles'].includes(url_parts[3])) profile();
}