// Love Acos(^-^)/

// TODO: Change setting from "buddy_button" to "buddy_system"

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
			if (!response.sap_extension || !response.sap_extension.settings) return resolve(1); // Check if the extensions data can be read
			else resolve(sap_extension = response.sap_extension); // Saves the user settings to the internal settings
		});
	});
}

function find_window() {
	if (loc.origin !== `https://steamcommunity.com`) return;
	chrome.runtime.sendMessage({ "icon_path": 'img/sap_good.png' });

	const url_parts = loc.full.split(`/`);
	const
		a = url_parts[3],
		b = url_parts[5];

	const controller = (result, callback) => {
		loc.result = result;
		callback();
	};

	if (!b && ['id', 'profiles'].includes(a))
		return controller('profiles', profile);

  /*if (b === 'tradeoffers')
    return controller('trade_offers_page', () => log('tradeoffers page'));*/

	if (a === 'tradeoffer')
		return controller('trade_offers', trade_window);

}
