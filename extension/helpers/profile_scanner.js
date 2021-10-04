function impersonatorScanner(profile) {
	const services = {
		marketplacetf: {
			personaname: `MPTF Bot `,
			personaname_display: `Marketplace.TF Bots`,
			profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c50215efc86d85386d4e963589c175a48e74a647_full.jpg',
			link: `https://marketplace.tf/bots`,
			type: `bot`
		},
		manncostore: {
			personaname: `Mannco.store | Bot `,
			personaname_display: `Mannco.store Bots`,
			profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/4b/4b2b43c016a3fa7d915f99df1ef9436b7ad4a0ad_full.jpg',
			link: `https://mannco.store/bots`,
			type: `bot`
		},
		bitskins: {
			personaname: `BitSkins `,
			personaname_display: `BitSkins Bots`,
			profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/8d/8dcad7f2f549bb502bc7268dc476ddb3ff3d04df_full.jpg',
			link: `https://bitskins.com`,		// No solid "/bots" page. Shame!
			type: `bot`
		}
	};
	let { manncostore, marketplacetf, bitskins, backpacktf, trusted_users } = sap_data.local;

	let similar_profiles = []; // List of profiles that are similar to the current one.
	const trusted_bots = [...manncostore, ...marketplacetf, ...bitskins];
	let trusted_profiles = [...backpacktf];
	let return_data = { summary: '', trusted: false, impersonator_profile: null };	// The data returned at the end of this
	// NOTE: Summary is used to communicate to the end user about the results. If someone is an imposter, summary should read "Imposter" (SUS!)

	// If the user has the trusted system enabled, add the trusted users to the list
	if (storage.settingIsEnabled('profile_trusted_user_system'))
		trusted_profiles = [...trusted_profiles, ...trusted_users];

	// Compare the supplied user against a list of trusted users.
	for (let user = 0; Object.keys(services).length > user; user++) {
		const target_service = services[Object.keys(services)[user]]; // The target service to check against.

		let trimmed_name = profile.personaname;
		trimmed_name.length = target_service.personaname.length;	// Trim the name to the length of our sample

		const personaname_sim = compareString(target_service.personaname, trimmed_name);

		if (personaname_sim < 70)
			continue;

		if (trusted_bots.includes(profile.steamid)) {
			setReturnData({ summary: 'Trusted Trading Bot', trusted: true });
			break;
		}

		similar_profiles.push({ profile: target_service, similarity: personaname_sim, type: 'bot' });
	}

	// If they are not a bot, then check them against the user list
	for (let user = 0; trusted_profiles.length > user; user++) {
		const personaname_sim = compareString(trusted_profiles[user].personaname, profile.personaname);

		if (personaname_sim < 70)
			continue;

		if (trusted_profiles[user].steamid === profile.steamid) {
			setReturnData({ summary: 'Trusted User', trusted: true });
			break;
		};

		// If the name is similar and does not match the SteamID, add them to the list.
		similar_profiles.push({ profile: trusted_profiles[user], similarity: personaname_sim, type: 'user' });
	}

	setReturnData({ impersonator_profile: getMostLikelyImpersonated() });
	return return_data;


	// --- Functions ---------------------------------------------------------------------
	// This function allows easy and one line manipulation of the return data.
	function setReturnData({ summary, trusted, impersonator, impersonator_profile } = {}) {
		if (summary) return_data.summary = summary;
		if (trusted) return_data.trusted = trusted;
		if (impersonator) return_data.impersonator = impersonator;
		if (impersonator_profile) return_data.impersonator_profile = impersonator_profile;
	}
	// Returns the profile that has the highest chance of being impersonated.
	function getMostLikelyImpersonated() {
		if (similar_profiles.length === 0) return null;
		let return_profile = { similarity: 0 }; // The profile to return 

		similar_profiles.forEach((impersonator) => {
			if (impersonator.similarity > return_profile.similarity) return_profile = impersonator;
		});

		// Update our detection data
		sap_data.sync.statistics.impersonators_detected++;
		storage.save({ sync: sap_data.sync });

		return return_profile;
	}
}