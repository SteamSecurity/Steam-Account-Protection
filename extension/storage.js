let sap_data = { local: {}, sync: {} };

const storage = {
	// Data management and storage
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

		chrome.storage.local.set({
			sap_data: {
				trusted_users: [],
				profile_reputation: {}
			}
		});
	},
	save: ({ sync, local } = {}) => {
		console.log(`Saved! ${sync ? `Sync` : ``}${local ? `Local` : ``}`);
		if (local) chrome.storage.local.set({ sap_data: local });
		if (sync) chrome.storage.sync.set({ sap_data: sync });
	},
	getNewReferenceData: async (save = true) => {
		const response = await Promise.all([manncostore.getBots(), marketplacetf.getBots(), bitskins.getBots(), backpacktf.getImpersonatedProfiles()]);
		sap_data.local['manncostore'] = response[0];
		sap_data.local['marketplacetf'] = response[1];
		sap_data.local['bitskins'] = response[2];
		sap_data.local['backpacktf'] = response[3];
		if (save) storage.save({ local: sap_data.local });
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
	settingIsEnabled: (setting) => {
		console.log(`Checking ${setting} => ${sap_data.sync.settings[setting]}`);
		return sap_data.sync.settings[setting];
	},

	// Profile trusts
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
	},
	addTrustedUser: (profile) => {
		sap_data.local.trusted_users.push({ steamid: profile.steamid, personaname: profile.personaname, profile_picture: profile.profile_picture });
		storage.save({ local: sap_data.local });
	},
	removeTrustedUser: (steamid) => {
		for (let user = 0; sap_data.local.trusted_users.length > user; user++) {
			if (sap_data.local.trusted_users[user].steamid = steamid) {
				sap_data.local.trusted_users.splice(user, 1);
				storage.save({ local: sap_data.local });
				break;
			}
		}
	},

	// Reputation
	getProfileReputation: (steamid) => {
		if (!sap_data.local.profile_reputation[steamid]) return null;
		if (time.checkAge(sap_data.local.profile_reputation[steamid].last_updated, 24)) return null;
		log(`Got ${steamid} reputation from cache`, `notice`);
		return sap_data.local.profile_reputation[steamid];
	},
	saveProfileReputation: (steamid, reputation) => {
		sap_data.local.profile_reputation[steamid] = reputation;
		storage.save({ local: sap_data.local });
	}
};