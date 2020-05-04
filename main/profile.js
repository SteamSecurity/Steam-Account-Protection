function profile() {
	var profile_data = {
		user: {
			personaname: document.querySelector(`.profile_header_bg .persona_name .actual_persona_name`)?.innerText,
			profile_picture: document.querySelector(`.profile_header_bg .playerAvatar img`)?.src,
			steamid: /7[0-9]{16}/g.exec(/"steamid":"7[0-9]{16}"/g.exec(document.querySelector(`.responsive_page_template_content script`).innerText)[0])[0],
			level: document.querySelector(`.profile_header_badgeinfo_badge_area .friendPlayerLevelNum`)?.innerText || 0
		},
		buddy_data: {}
	};

	profile_data.buddy_data = find_user.buddy(profile_data.user.steamid);	// Get the saved buddy data
	handle_html();
	if (sap_extension.settings.profile.buddy_button && is_not_owner()) {
		buddy();
	}
	if (sap_extension.settings.profile.pr_reputation_scanner) {
		reputation_scanner();
	}
	if (sap_extension.settings.profile.pr_impersonator_scanner && !profile_data.buddy_data.is_buddy()) {
		impersonator_scanner(profile_data.user);
	}

	// Update any buddy data ===========================
	if (profile_data.buddy_data.is_buddy()) {
		sap_extension.data.user_profiles.buddies.splice(profile_data.buddy_data.index, 1);
		sap_extension.data.user_profiles.buddies.push(profile_data.user);
		save_settings();
	}

	// Load Stylesheets files ==========================
	function handle_html() {
		document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(`html/stylesheets/profile.css`)}">`);
		document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(`html/stylesheets/trade_window.css`)}">`);
	}

	// Checks if Profile is the user ===================
	function is_not_owner() {
		return document.querySelector(`.profile_header_actions .btn_profile_action`)?.children[0].innerText !== `Edit Profile` || false;
	}

	// Handle the Buddy settings =======================
	function buddy() {
		document.querySelector('.profile_header_actions').style.display = 'flex'; // Allows easy plug in for our buddy button
		document.querySelector(`.profile_header_actions`).insertAdjacentHTML(`beforeend`, html_elements.profile.buddy_button);

		// User is a buddy ========
		if (profile_data.buddy_data.is_buddy()) {
			log(`${profile_data.user.personaname} is a Buddy`);
			document.querySelector(`#buddy-button img`).src = chrome.extension.getURL('images/user_slash.png');
			document.querySelector(`#buddy-button`).addEventListener(`click`, () => {
				sap_extension.data.user_profiles.buddies.splice(profile_data.buddy_data.index, 1);
				save_settings();
				window.location.reload(false);
			});
			return;
		}
		// User IS NOT a buddy ====
		document.querySelector(`#buddy-button`).addEventListener(`click`, () => {
			document.querySelector(`body`).insertAdjacentHTML(`beforebegin`, html_elements.profile.buddy_add_warning);

			// Set overlay data
			document.querySelector(`#buddy-partner-profile-picture`).src = profile_data.user.profile_picture;
			document.querySelector(`#buddy-partner-personaname`).innerText = profile_data.user.personaname;
			document.querySelector(`#buddy-partner-steamid`).innerText = profile_data.user.steamid;
			document.querySelector(`#buddy-partner-level`).innerText = profile_data.user.level;
			document.querySelector(`#buddy-partner-level`).parentElement.className += ` ${steam_level_class(profile_data.user.level)}`;

			// Buttons on the overlay
			document.querySelector(`#buddy-add`).addEventListener(`click`, () => {
				sap_extension.data.user_profiles.buddies.push(profile_data.user);
				save_settings();
				window.location.reload(false);
			});
			document.querySelector(`#buddy-close`).addEventListener(`click`, () => {
				document.querySelector(`#buddy-warning`).parentElement.remove();
			});
		});
		return;
	}


	function reputation_scanner() {
		// Insert reputation panel ======
		if (!document.querySelector(`.profile_customization_area`)) {
			document.querySelector('.profile_leftcol').insertAdjacentHTML('afterbegin', '<div class="profile_customization_area"></div>');
		}
		document.querySelector(`.profile_customization_area`).insertAdjacentHTML(`afterbegin`, html_elements.profile.reputation_panel);

		// Set links and user data =======
		document.querySelector(`#reputation-panel-title`).innerText = `${profile_data.user.personaname}'s SteamRep Reputation`;
		// SteamRep ==
		document.querySelector(`#reputation-panel-permlink`).innerText = `https://steamcommunity.com/profiles/${profile_data.user.steamid}`;
		document.querySelector(`#reputation-panel-steamid`).value = profile_data.user.steamid;

		// Other ====
		document.querySelector(`#reputation-panel-reptf`).href = `https://rep.tf/${profile_data.user.steamid}`;
		document.querySelector(`#reputation-panel-backpacktf`).href = `https://backpack.tf/profiles/${profile_data.user.steamid}`;
		document.querySelector(`#reputation-panel-bazaartf`).href = `https://bazaar.tf/profiles/${profile_data.user.steamid}`;
		document.querySelector(`#reputation-panel-scraptf`).href = `https://scrap.tf/profile/${profile_data.user.steamid}`;
		document.querySelector(`#reputation-panel-marketplacetf`).href = `https://marketplace.tf/shop/${profile_data.user.steamid}`;
		document.querySelector(`#reputation-panel-steamiduk`).href = `https://steamid.eu/profile/${profile_data.user.steamid}`;
		document.querySelector(`#reputation-panel-steamtrades`).href = `https://www.steamtrades.com/user/${profile_data.user.steamid}`;
		document.querySelector(`#reputation-panel-google`).href = `https://www.google.com/search?q="${profile_data.user.steamid}"`;

		// Request reputation data =======
		api.reputation.steamrep(profile_data.user.steamid).then((reputation_data) => {
			steamrep_tags(reputation_data);
			steamrep_pending_reports(reputation_data);
		});

		function steamrep_tags(reputation_data) {
			document.querySelector(`#reputation-panel-steamrep`).href = `https://steamrep.com/profiles/${profile_data.user.steamid}`;
			// Evil tags =============
			if (reputation_data.bad_tags.length > 0) {
				let text = ``;
				reputation_data.bad_tags.forEach((tag) => {
					text += `${tag}, `;
				});
				document.querySelector(`#reputation-panel-steamrep`).style.color = `#ff4c4c`;
				document.querySelector(`#reputation-panel-steamrep`).innerText = text.slice(0, -2);
				return;
			}
			// Good tags =============
			if (reputation_data.good_tags.length > 0) {
				let text = ``;
				reputation_data.good_tags.forEach((tag) => {
					text += `${tag}, `;
				});
				document.querySelector(`#reputation-panel-steamrep`).style.color = `#26ff00`;
				document.querySelector(`#reputation-panel-steamrep`).innerText = text.slice(0, -2);
				return;
			}
			document.querySelector(`#reputation-panel-steamrep`).innerText = `Normal`;
		}

		function steamrep_pending_reports(reputation_data) {
			document.querySelector(`#reputation-panel-pendingreports`).href = reputation_data.pending_reports_link;
			document.querySelector(`#reputation-panel-pendingreports`).innerText = `${reputation_data.pending_reports} Pending reports`;
			if (reputation_data.pending_reports > 0) {
				document.querySelector(`#reputation-panel-pendingreports`).style.color = `#ffe100`;
			}
		}
	}
}
