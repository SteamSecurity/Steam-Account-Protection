let sap_data = { local: {}, sync: {} };

const storage = {
	generateNewSettings: () => {
		chrome.storage.sync.set({
			sap_data: {
				settings: {
					profile_trusted_user_system: true,
					profile_reputation: true,
					profile_reputation_overlay: true,
					profile_impersonator_scanner: true,
					profile_impersonator_overlay: true,

					tradewindow_overhauled_toolbar: true,
					tradewindow_reputation_checker: true,
					tradewindow_reputation_overlay: true,
					tradewindow_impersonator_scanner: true,
					tradewindow_impersonator_overlay: true,

					dev_anon_profiles: false,
					dev_anon_tradewindow: false
				},
				statistics: {
					impersonators_detected: 0,
					reputation_detected: 0
				}
			}
		});

		// We don't necessarily need to add local settings here right now.
		// This is just to map out the structure of the object
		// FIXME
		chrome.storage.local.set({
			sap_data: {
				trusted_users: []
			}
		});
	},
	save: ({ sync, local } = {}) => {
		if (local) chrome.storage.local.set({ sap_data: local });
		if (sync) chrome.storage.sync.set({ sap_data: sync });
	},
	getNewReferenceData: async () => {
		const response = await Promise.all([manncostore.getBots(), marketplacetf.getBots(), bitskins.getBots(), backpacktf.getImpersonatedProfiles()]);
		let reference_data = {};

		reference_data['manncostore'] = response[0];
		reference_data['marketplacetf'] = response[1];
		reference_data['bitskins'] = response[2];
		reference_data['backpacktf'] = response[3];
		reference_data['trusted_users'] = sap_data.local.trusted_users || [];
		storage.save({ local: reference_data });
	},
	loadData: () => {
		return new Promise((resolve) => {
			sap_data = { local: {}, sync: {} };

			chrome.storage.local.get(['sap_data'], (response) => {
				sap_data.local = response.sap_data;

				chrome.storage.sync.get(['sap_data'], (responses) => {
					sap_data.sync = responses.sap_data;
					resolve(sap_data);
				});
			});
		});
	},
	getTrustedUser: (steamid) => {
		return new Promise((resolve) => {
			for (let user = 0; sap_data.local.trusted_users.length > user; user++) {
				console.log(sap_data.local.trusted_users[user]);
				if (sap_data.local.trusted_users[user].steamid === steamid) {
					resolve(sap_data.local.trusted_users[user]);
					break;
				}
			}
			resolve(null);
		});
	}
};