function impersonatorScanner(profile) {
	const services = {
		marketplacetf: {
			personaname: `Marketplace.TF | Bot `,
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
	if (!manncostore && !marketplacetf && !bitskins && !backpacktf && trusted_users) {
		log.standard('Data not initialized', 'error');
		return {};
	}

	let similar_profiles = []; 																																												// List of profiles that are similar to the current one.
	let trusted_bots = [...manncostore, ...marketplacetf, ...bitskins];
	let trusted_profiles = [...backpacktf];
	let trusted_user_data;


	if (storage.settingIsEnabled('profile_trusted_user_system')) trusted_profiles = [...trusted_profiles, ...trusted_users];	// If the Trusted User system is enabled, add the user defined users to the trusted_profiles list.

	trusted_profiles.forEach(comparePersona);																																					// These are real people with real information attached to them.
	Object.keys(services).forEach((service_name) => comparePersona(services[service_name]));													// These are bots supplied by the service object above, there is no real information about them.

	if (!trusted_user_data) return mostLikelyImpersonated();
	else return trusted_user_data;

	// ─── COMPARING ──────────────────────────────────────────────────────────────────
	function comparePersona(trusted_user) {
		const personaname_sim = compareString(trusted_user.personaname, profile.personaname);

		if (personaname_sim < 70) return;
		if (trusted_user.steamid === profile.steamid) return trusted_user_data = { summary: 'Trusted User', trusted: true };
		if (trusted_bots.includes(profile.steamid)) return trusted_user_data = { summary: 'Trusted Trading Bot', trusted: true };

		return similar_profiles.push({ profile: trusted_user, similarity: personaname_sim });
	}

	function mostLikelyImpersonated() {
		if (similar_profiles.length === 0) return { trusted: false };
		let most_likely = { similarity: 0 };
		similar_profiles.forEach((impersonated_profile) => {
			if (impersonated_profile.similarity > most_likely.similarity)
				most_likely = impersonated_profile;
		});

		sap_data.sync.statistics.impersonators_detected++;
		storage.save({ sync: sap_data.sync });

		return { profile: most_likely, trusted: false, impersonator: true } || null;
	}
}