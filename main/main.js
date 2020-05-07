// Love Acos(^-^)/

// Quick location
var loc = {
	full: window.location.href,
	origin: window.location.origin,
	result: ``
};

var sap_extension = {};	// The extension settings that all of the files will use

main();
async function main() {
	await get_data();
	find_window();
	api.filter.profiles();
}

async function get_data() {
	return new Promise((resolve) => {
		chrome.storage.local.get(['sap_extension'], (response) => {
			// Check if the extensions data can be read
			if (response.sap_extension === undefined || response.sap_extension.settings === undefined) {
				resolve(1);
				return;
			}
			// Saves the user settings to the internal settings
			sap_extension = response.sap_extension;
			resolve(1);
		});
	});
}

function find_window() {
	// If the window is on a SteamCommunity webpage
	if (loc.origin === `https://steamcommunity.com`) {
		// Profiles page.
		if ((loc.full.split(`/`)[3] === `id` || loc.full.split(`/`)[3] === `profiles`) && !loc.full.split(`/`)[5]) {
			loc.result = `profile`;
			profile();
			return;
		}

		// Trade offers page
		if (loc.full.split(`/`)[5] === `tradeoffers`) {
			loc.result = `trade_offer_page`;
			log(`tradeoffers Page`);
			return;
		}

		//Live trade offer
		if (loc.full.split(`/`)[3] === `tradeoffer`) {
			loc.result = `trade_offer`;
			trade_window();
			return;
		}
	}
}
