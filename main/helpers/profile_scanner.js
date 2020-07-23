const user_scanner = {
	impersonator: (profile) => {
		const { impersonated, buddies } = sap_extension.data.user_profiles; // Impersonator scanner
		const services = {
			marketplace: {
				personaname: `Marketplace.TF | Bot `,
				personaname_display: `Marketplace.TF Bots`,
				profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c50215efc86d85386d4e963589c175a48e74a647_full.jpg',
				link: `https://marketplace.tf/bots`,
				type: `bot`
			},
			mannco: {
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
			const personaname_similarity = compare.string(impersonated_user.personaname.trim(), profile.personaname.trim());

			if (personaname_similarity < 70) return;
			if (impersonated_user.steamid === profile.steamid) return;

			potentially_impersonated_list.push({ profile: impersonated_user, similarity: personaname_similarity });	// Store the real user for later
		}

		function check_bot(service) {															// "service" is the name of a service that controls a bot.
			const service_data = services[service];
			const personaname_similarity = compare.string(service_data.personaname, profile.personaname);

			if (personaname_similarity < 70) return;
			if (sap_extension.data.bot_profiles[service].includes(profile.steamid)) return;

			potentially_impersonated_list.push({ profile: services[service], similarity: personaname_similarity });	// Store the real user for later
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

// Single function call to run the impersonator scanner
function impersonator_scanner(profile) {
	const impersonator_result = user_scanner.impersonator(profile);
	if (impersonator_result === null) return;							// If no impersonator was found, we're done

	overlays.impersonator(profile, impersonator_result);	// Spawn the impersonator overlay
}

function reputation_scanner(steamid) {
	return new Promise(async (resolve, reject) => {
		api.reputation.steamrep(steamid)
			.then((profile_data) => get_bad_tags(profile_data))
			.catch(reject);

		function get_bad_tags(profile_data) {
			if (profile_data.bad_tags.length > 0)
				overlays.reputation();

			return resolve(profile_data);
		}
	});
}