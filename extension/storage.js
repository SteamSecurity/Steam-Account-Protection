let sap_data = { local: {}, sync: {} };

const storage = {
	// Data management and storage
	generateNewSettings: async () => {
		log.debug(`Generating fresh settings`);
		chrome.storage.sync.set({
			sap_data: {
				settings: {
					profile_trusted_user_system: true,

					reputation: true,
					reputation_overlay: true,
					impersonator_scanner: true,
					impersonator_overlay: true,

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
		return;
	},
	save: ({ sync, local } = {}) => {
		log.debug(`Saved settings: ${sync ? `Sync` : ``}${local ? `Local` : ``}`);
		if (local) chrome.storage.local.set({ sap_data: local });
		if (sync) chrome.storage.sync.set({ sap_data: sync });
	},
	getNewReferenceData: async (save = true) => {
		log.debug(`Getting new reference data`);
		const response = await Promise.all([manncostore.getBots(), marketplacetf.getBots(), bitskins.getBots(), backpacktf.getImpersonatedProfiles()]);
		sap_data.local['manncostore'] = response[0];
		sap_data.local['marketplacetf'] = response[1];
		sap_data.local['bitskins'] = response[2];
		sap_data.local['backpacktf'] = response[3];
		if (save) storage.save({ local: sap_data.local });
		return true;
	},
	loadData: () => {
		return new Promise((resolve) => {
			sap_data = { local: {}, sync: {} };

			chrome.storage.local.get(['sap_data'], (response) => {
				sap_data.local = response.sap_data;

				chrome.storage.sync.get(['sap_data'], async (responses) => {
					sap_data.sync = responses.sap_data;
					// TODO: When downloading the extension. This triggers AFTER getting the reference data!
					if (!sap_data.local || !sap_data.sync) {
						storage.generateNewSettings();
						const newdata = await storage.loadData();
						return resolve(newdata);
					}
					else resolve(sap_data);
				});
			});
		});
	},
	settingIsEnabled: (setting) => {
		log.debug(`Setting \'${setting}\' is ${sap_data.sync.settings[setting]}`);
		return sap_data.sync.settings[setting];
	},
	resetSettings: async () => {
		console.debug('resetting settings');
		await storage.generateNewSettings()
			.then(storage.loadData)
			.then(storage.getNewReferenceData)
			.then(() => { return; });
	},

	// Profile trusts
	getTrustedUser: (steamid) => {
		return new Promise((resolve) => {
			for (let user = 0; sap_data.local.trusted_users.length > user; user++) {
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
		log.standard(`Got ${steamid} reputation from cache`, 'notice');
		return sap_data.local.profile_reputation[steamid];
	},
	saveProfileReputation: (steamid, reputation) => {
		sap_data.local.profile_reputation[steamid] = reputation;
		storage.save({ local: sap_data.local });
	},
	removeOldReputation: () => {
		let reputation_object = sap_data.local.profile_reputation;
		let steamid_list = Object.keys(reputation_object);

		console.log(steamid_list);

		steamid_list.forEach((steamid) => {
			if (time.checkAge(reputation_object[steamid].last_updated, 0.0000000000000001)) {
				log.standard(`Deleted ${reputation_object[steamid].steamid}`);
				reputation_object[steamid].delete();
			}
			if (!time.checkAge(reputation_object[steamid].last_updated, 0.0000000000000001)) {
				log.standard(`Not ${reputation_object[steamid].steamid}`);
			}
			console.log(reputation_object[steamid].last_updated);
		});
		sap_data.local.profile_reputation = reputation_object;
	}
};