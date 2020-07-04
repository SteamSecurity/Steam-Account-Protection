const storage = {
	save_settings: (set_default) => {
		if (!set_default) return chrome.storage.local.set({ sap_extension: sap_extension });  // Save the current settings

		// Save the default settings
		sap_extension = {
			settings: {
				trade_window: {
					api_warning: true,
					trade_toolbar: true,
					tw_reputation_scanner: true,
					tw_impersonator_scanner: true
				},
				profile: {
					buddy_button: true,
					pr_reputation_scanner: true,
					pr_impersonator_scanner: true
				}
			},
			data: {
				backpacktf: {
					refined: {
						usd: null
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
		chrome.storage.local.set({ sap_extension: sap_extension });
	},
	get_settings: () => {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get(['sap_extension'], (response) => {
				if (!response.sap_extension || !response.sap_extension.settings) return reject({ error: `Could not read settings` }); // Check if the extensions data can be read
				else resolve(response.sap_extension); // Saves the user settings to the internal settings
			});
		});
	},

	// Reputation
	find_buddy: (steamid) => {
		let data = { response: {}, index: -1, is_buddy: () => data.index !== -1 };
		sap_extension.data.user_profiles.buddies.find((buddy, index) => {
			if (buddy.steamid === steamid) {
				data.response = buddy;
				data.index = index;
			}
		});
		return data;
	}
}