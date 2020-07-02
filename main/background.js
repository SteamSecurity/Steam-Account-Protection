chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.create({
		url: chrome.runtime.getURL('html/pages/settings_page.html')
	});
});

chrome.runtime.onInstalled.addListener(function (details) {
	if (details.reason == 'install') {
		chrome.tabs.create({
			url: chrome.runtime.getURL('html/pages/welcome_page.html')
		});
	}
	if (details.reason == 'update') {
		const default_settings = {
			settings: {
				trade_window: {
					api_warning: true,
					trade_toolbar: true,
					tw_reputation_scanner: true,
					tw_impersonator_scanner: true
				},
				trade_offers: {},
				profile: {
					buddy_button: true,
					pr_reputation_scanner: true,
					pr_impersonator_scanner: true
				}
			},
			data: {
				backpacktf: {
					refined: {
						usd: null,
						last_check: 0
					}
				},
				bot_profiles: {
					marketplace: [],
					mannco: [],
					bitskins: [],
					last_check: 0
				},
				user_profiles: {
					impersonated: [],
					buddies: [],
					steamrep_profiles: [],
					reptf_profiles: [],
					last_check: 0
				}
			}
		};
		chrome.storage.local.get(['sap_extension'], (response) => {
			let new_settings = default_settings;
			update_object(new_settings, response.sap_extension);  // Adds new things to the users settings using default_settings without resetting the settings
			chrome.storage.local.set({ sap_extension: new_settings });  // Save the new settings
		});

		function update_object(destination, source) {
			for (var property in source) {
				if (typeof source[property] === 'object' && source[property] !== null) {
					destination[property] = destination[property] || {};
					arguments.callee(destination[property], source[property]);
				} else {
					destination[property] = source[property];
				}
			}
		}
	}
});
