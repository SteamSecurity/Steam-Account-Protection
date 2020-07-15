const user_scanner = {
	impersonator: (profile) => {
		const { impersonated, buddies } = sap_extension.data.user_profiles; // Impersonator scanner
		const services = {
			marketplace: {
				personaname: `Marketplace.TF | Bot `,
				profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c50215efc86d85386d4e963589c175a48e74a647_full.jpg',
				type: `bot`
			},
			mannco: {
				personaname: `Mannco.store | Bot `,
				profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/4b/4b2b43c016a3fa7d915f99df1ef9436b7ad4a0ad_full.jpg',
				type: `bot`
			},
			bitskins: {
				personaname: `BitSkins `,
				profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/8d/8dcad7f2f549bb502bc7268dc476ddb3ff3d04df_full.jpg',
				type: `bot`
			}
		};

		let potentially_impersonated_list = [];										// Stores all users the supplied profile may be impersonating

		let impersonated_list = impersonated;

		if (sap_extension.settings.profile.buddy_button)					// If the buddy system is enabled, treat the buddies as potentially impersonated
			impersonated_list = [...impersonated, ...buddies];

		/* --------------------------------- Master --------------------------------- */
		impersonated_list.forEach(check_profile);									// Checks for a "User impersonating User" case
		Object.keys(services).forEach(check_bot);									// Checks for a "User impersonating Bot" case
		return most_likely_impersonated();

		/* -------------------------------- Functions ------------------------------- */
		function check_profile(impersonated_user) {								// "impersonated_user" is the real user obtained from Backpack.tf API
			const personaname_similarity = compare.string(profile.personaname.trim(), impersonated_user.personaname.trim());
			if (personaname_similarity < 70) return;
			if (impersonated_user.steamid === profile.steamid) return;

			potentially_impersonated_list.push({ profile: impersonated_user, similarity: personaname_similarity });	// Store the real user for later
		}

		function check_bot(service) {															// "service" is the name of a service that controls a bot.
			const service_data = services[service];
			const profile_personaname_short = profile.personaname.slice(0, service_data.personaname.length);
			const personaname_similarity = compare.string(profile_personaname_short, service_data.personaname);

			if (personaname_similarity < 70) return;
			if (sap_extension.data.bot_profiles[service].includes(profile.steamid)) return;

			potentially_impersonated_list.push({ profile: service, similarity: personaname_similarity });	// Store the real user for later
		}

		function most_likely_impersonated() {
			let most_likely = { similarity: 0 };
			potentially_impersonated_list.forEach((impersonated_profile) => {
				if (impersonated_profile.similarity > most_likely.similarity)
					most_likely = impersonated_profile;
			});
			return most_likely.profile || null;
		}
	}
};
//TODO: compare string to store all matches of (X) <. Find the biggest value and display that
//TODO: Add link to service in the services={ ???