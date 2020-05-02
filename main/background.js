chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({
		url: chrome.runtime.getURL('html/pages/settings_page.html')
	});
});

chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == 'install') {
		chrome.tabs.create({
			url: chrome.runtime.getURL('html/pages/welcome_page.html')
		});
	}
	if (details.reason == 'update') {
		let default_settings = {
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
		// Get the current user settings
		chrome.storage.local.get(['sap_extension'], (response) => {
			let new_settings = response.sap_extension;
			update_object(new_settings, default_settings);
			chrome.storage.local.set({ sap_extension: new_settings });

			// Updates object. The "destination" object will be updated
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
		});
	}
});
