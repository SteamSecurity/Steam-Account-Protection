function impersonator_scanner(profile_data) {
	const patterns = {
		marketplace: {
			personaname: `Marketplace.TF | Bot `,
			profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c50215efc86d85386d4e963589c175a48e74a647_full.jpg'
		},
		mannco: {
			personaname: `Mannco.store | Bot `,
			profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/4b/4b2b43c016a3fa7d915f99df1ef9436b7ad4a0ad_full.jpg'
		},
		bitskins: {
			personaname: `BitSkins `,
			profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/8d/8dcad7f2f549bb502bc7268dc476ddb3ff3d04df_full.jpg'
		}
	};
	const { personaname, steamid, profile_picture } = profile_data; // The user we are checking for
	const { impersonated, buddies } = sap_extension.data.user_profiles; // Impersonator scanner

	let impersonated_list = impersonated;
	if (sap_extension.settings.profile.buddy_button) impersonated_list = [...impersonated, ...buddies];

	impersonated_list.forEach(check_against_profile); // Check the user using the impersonated list. This uses real people
	[`marketplace`, `mannco`, `bitskins`].forEach(check_against_bot); // Check the user against supported services. This uses bots

	async function check_against_profile(impersonated_user) {
		const personaname_similarity = compare.string(personaname.slice(0, impersonated_user.personaname.length), impersonated_user.personaname);

		if (personaname_similarity < 70) return;
		if (impersonated_user.steamid === steamid) return;

		overlay(impersonated_user);   // Impersonator overlay 
		levels(impersonated_user); // Get the level of the impersonated user

		if (qs(`#trade-toolbar`)) qs(`#trade-toolbar-warning-user-impostor`).style.display = `block`; // Trade Toolbar Warning
	}

	async function check_against_bot(service) {
		const personaname_similarity = compare.string(personaname.slice(0, patterns[service].personaname.length), patterns[service].personaname); // Compare only to the length of the patterns[service] length

		if (personaname_similarity < 50) return;
		if (sap_extension.data.bot_profiles[service].includes(steamid)) return;

		bot_overlay(service);  // Bot Impersonator overlay 
	}

	function overlay(impersonated_user) {
		if (qs(`#impersonator-warning`)) return;
		const set_overlay_value = (args) => { qs(`#impersonator-${args.user}-${args.name}`)[args.type] = args.value; };  // Quickly change the value of an overlay element

		qs(`body`).insertAdjacentHTML(`beforebegin`, html_elements.multi.impersonator_warning());
		qs(`#impersonator-close`).addEventListener(`click`, () => qs(`#impersonator-warning`).parentElement.remove());

		[
			{ user: `partner`, name: `profile-picture`, type: `src`, value: profile_picture },
			{ user: `partner`, name: `url`, type: `href`, value: `https://steamcommunity.com/profiles/${steamid}` },
			{ user: `partner`, name: `personaname`, type: `innerText`, value: personaname },
			{ user: `partner`, name: `steamid`, type: `innerText`, value: steamid },
			{ user: `partner`, name: `level`, type: `innerText`, value: profile_data.level },
			{ user: `impersonated`, name: `profile-picture`, type: `src`, value: impersonated_user.profile_picture },
			{ user: `impersonated`, name: `url`, type: `href`, value: `https://steamcommunity.com/profiles/${impersonated_user.steamid}` },
			{ user: `impersonated`, name: `personaname`, type: `innerText`, value: impersonated_user.personaname },
			{ user: `impersonated`, name: `steamid`, type: `innerText`, value: impersonated_user.steamid }
		].forEach(set_overlay_value);
		qs(`#impersonator-partner-level`).parentElement.className += ` ${steam.level_class(profile_data.level)}`;

	}
	async function levels(impersonated_user) {
		const raw_data = await webrequest(`get`, `https://steamcommunity.com/profiles/${impersonated_user.steamid}`);
		const level_pattern = /<span class="friendPlayerLevelNum">[0-9]+<\/span><\/div><\/div>/g.exec(raw_data);
		const level = /[0-9]+/g.exec(level_pattern);
		if (!qs(`#impersonator-warning`)) return; // If the user closes the popup immediately, it won't set the level data

		qs(`#impersonator-impersonated-level`).innerText = level;
		qs(`#impersonator-impersonated-level`).parentElement.className += ` ${steam.level_class(Number(level))}`;
	}
	function bot_overlay(community) {
		const set_overlay_value = (args) => { qs(`#bot-impersonator-${args.user}-${args.name}`)[args.type] = args.value; };  // Quickly change the value of an overlay element
		qs(`body`).insertAdjacentHTML(`beforebegin`, html_elements.multi.bot_impersonator_warning());
		qs(`#bot-impersonator-close`).addEventListener(`click`, () => qs(`#bot-impersonator-warning`).parentElement.remove());

		[
			{ user: `partner`, name: `profile-picture`, type: `src`, value: profile_picture },
			{ user: `partner`, name: `url`, type: `href`, value: `https://steamcommunity.com/profiles/${steamid}` },
			{ user: `partner`, name: `personaname`, type: `innerText`, value: personaname },
			{ user: `partner`, name: `steamid`, type: `innerText`, value: steamid },
			{ user: `impersonated`, name: `profile-picture`, type: `src`, value: patterns[community].profile_picture },
			{ user: `impersonated`, name: `personaname`, type: `innerText`, value: `${community.charAt(0).toUpperCase() + community.slice(1)} Bots` },
		].forEach(set_overlay_value);

		// Trade Toolbar Warning
		if (qs(`#trade-toolbar`)) qs(`#trade-toolbar-warning-bot-impostor`).style.display = `block`;
	}
}
