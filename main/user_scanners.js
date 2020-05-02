// Impersonator Scanner =============================
async function impersonator_scanner(profile_data) {
	const patterns = {
		marketplace: {
			personaname: /^Marketplace.TF \| Bot ([0-9]*|)$/,
			profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c50215efc86d85386d4e963589c175a48e74a647_full.jpg'
		},
		mannco: {
			personaname: /^Mannco.store \| Bot (|#)([ 0-9]{1,4}|)$/i,
			profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/4b/4b2b43c016a3fa7d915f99df1ef9436b7ad4a0ad_full.jpg'
		},
		bitskins: {
			personaname: /^BitSkins #([0-9]{1,5})( \[[0-9]{3}\]|)$/i,
			profile_picture: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/8d/8dcad7f2f549bb502bc7268dc476ddb3ff3d04df_full.jpg'
		}
	};
	// User Scanner ========
	let { impersonated, buddies } = sap_extension.data.user_profiles;

	//Combine buddies and impersonated
	let impersonated_list = [ ...impersonated, ...buddies ];

	for (let a = 0; impersonated_list.length > a; a++) {
		let username_similarity = compare.string(profile_data.personaname, impersonated_list[a].personaname),
			profile_picture_similarity = await compare.image(profile_data.profile_picture, impersonated_list[a].profile_picture);

		if (username_similarity >= 80 || profile_picture_similarity >= 87) {
			if (impersonated_list[a].steamid !== profile_data.steamid) {
				overlay(impersonated_list[a]);
				levels(impersonated_list[a]);

				// Trade Toolbar Warning
				if (document.querySelector(`#trade-toolbar`)) {
					document.querySelector(`#trade-toolbar-warning-user-impostor`).style.display = `block`;
				}
			}
			break; // Saves us from continuing if the user could have been a potential impostor
		}
	}

	// Bot Scanner =========
	let { marketplace, mannco, bitskins } = sap_extension.data.bot_profiles;

	if ((await compare.image(profile_data.profile_picture, patterns.marketplace.profile_picture)) >= 85 || patterns.marketplace.personaname.test(profile_data.personaname)) {
		if (!marketplace.includes(profile_data.steamid)) {
			impersonator_overlay(`marketplace`);
		}
		return;
	}
	if ((await compare.image(profile_data.profile_picture, patterns.mannco.profile_picture)) >= 85 || patterns.mannco.personaname.test(profile_data.personaname)) {
		if (!mannco.includes(profile_data.steamid)) {
			impersonator_overlay(`mannco`);
		}
		return;
	}
	if ((await compare.image(profile_data.profile_picture, patterns.bitskins.profile_picture)) >= 85 || patterns.bitskins.personaname.test(profile_data.personaname)) {
		if (!bitskins.includes(profile_data.steamid)) {
			impersonator_overlay(`bitskins`);
		}
		return;
	}

	// Impersonator overlay ==============
	async function overlay(impersonated_user) {
		if (!document.querySelector(`#impersonator-warning`)) {
			document.querySelector(`body`).insertAdjacentHTML(`beforebegin`, html_elements.multi.impersonator_warning());
			document.querySelector(`#impersonator-close`).addEventListener(`click`, () => document.querySelector(`#impersonator-warning`).parentElement.remove());

			// Trade partner ======
			document.querySelector(`#impersonator-partner-profile-picture`).src = profile_data.profile_picture;
			document.querySelector(`#impersonator-partner-url`).href = profile_data.url;
			document.querySelector(`#impersonator-partner-personaname`).innerText = profile_data.personaname;
			document.querySelector(`#impersonator-partner-steamid`).innerText = profile_data.steamid;
			document.querySelector(`#impersonator-partner-level`).innerText = profile_data.level;
			document.querySelector(`#impersonator-partner-level`).parentElement.classList.add(steam_level_class(profile_data.level));

			// Impersonated =======
			document.querySelector(`#impersonator-impersonated-profile-picture`).src = impersonated_user.profile_picture;
			document.querySelector(`#impersonator-impersonated-url`).href = impersonated_user.url;
			document.querySelector(`#impersonator-impersonated-personaname`).innerText = impersonated_user.personaname;
			document.querySelector(`#impersonator-impersonated-steamid`).innerText = impersonated_user.steamid;
		}
	}
	async function levels(impersonated_user) {
		// We need to make a request to steam to get the impersonated's level
		let raw_data = await xhr_send(`get`, impersonated_user.url);
		let level_pattern = /<span class="friendPlayerLevelNum">[0-9]+<\/span><\/div><\/div>/g.exec(raw_data);
		let level = /[0-9]+/g.exec(level_pattern);
		document.querySelector(`#impersonator-impersonated-level`).innerText = Number(level);
		document.querySelector(`#impersonator-impersonated-level`).parentElement.className += ` ${steam_level_class(Number(level))}`;
	}

	// Bot Impersonator overlay ========
	function impersonator_overlay(community) {
		document.querySelector(`body`).insertAdjacentHTML(`beforebegin`, html_elements.multi.bot_impersonator_warning());
		document.querySelector(`#bot-impersonator-close`).addEventListener(`click`, () => document.querySelector(`#bot-impersonator-warning`).parentElement.remove());

		// Trade partner ======
		document.querySelector(`#bot-impersonator-partner-profile-picture`).src = profile_data.profile_picture;
		document.querySelector(`#bot-impersonator-partner-url`).href = profile_data.url;
		document.querySelector(`#bot-impersonator-partner-personaname`).innerText = profile_data.personaname;
		document.querySelector(`#bot-impersonator-partner-steamid`).innerText = profile_data.steamid;

		// Impersonated =======
		document.querySelector(`#bot-impersonator-impersonated-profile-picture`).src = patterns[community].profile_picture;
		document.querySelector(`#bot-impersonator-impersonated-personaname`).innerText = `${community.charAt(0).toUpperCase() + community.slice(1)} Bots`;

		// Trade Toolbar Warning
		if (document.querySelector(`#trade-toolbar`)) {
			document.querySelector(`#trade-toolbar-warning-bot-impostor`).style.display = `block`;
		}
	}
}
