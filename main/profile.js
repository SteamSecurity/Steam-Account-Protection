function profile() {
	/* ---------------------------- Declare variables --------------------------- */
	const is_not_owner = () => qs(`.profile_header_actions .btn_profile_action`)?.children[0].innerText !== `Edit Profile` || false;
	const profile = {
		personaname: qs(`.profile_header_bg .persona_name .actual_persona_name`)?.innerText,
		profile_frame: qs(`.profile_header_bg .playerAvatar .playerAvatarAutoSizeInner .profile_avatar_frame img`)?.src,
		profile_picture: qs(`.profile_header_bg .playerAvatar .playerAvatarAutoSizeInner`)?.children[1]?.src || qs(`.profile_header_bg .playerAvatar .playerAvatarAutoSizeInner`)?.children[0]?.src,
		steamid: /7[0-9]{16}/g.exec(/"steamid":"7[0-9]{16}"/g.exec(qs(`.responsive_page_template_content script`).innerText)[0])[0],
		level: qs(`.profile_header_badgeinfo_badge_area .friendPlayerLevelNum`)?.innerText || 0
	};
	var buddy_data = {};

	/* ------------------------------- Controller ------------------------------- */
	// Decide what functions to execute depending on the user settings

	load_custom_content();
	buddy_data = find_user.buddy(profile.steamid);																							// Get the saved buddy data
	if (sap_extension.settings.profile.buddy_button && is_not_owner()) buddy();   							// The Buddy system
	if (sap_extension.settings.profile.pr_reputation_scanner) reputation_scanner(); 						// Scan the user's reputation and display it
	if (sap_extension.settings.profile.pr_impersonator_scanner) impersonator_scanner(profile); 	// Checks if the user is a potential impersonator

	/* -------------------------------- Functions ------------------------------- */
	function load_custom_content() {
		// Stylesheets
		qs('head').insertAdjacentHTML('beforeend', `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(`html/elements/profile/css/overlay.css`)}">`);
		qs('head').insertAdjacentHTML('beforeend', `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(`html/stylesheets/profile.css`)}">`);

		// Overlays
		qs(`body`).insertAdjacentHTML(`beforebegin`, html_elements.profile.buddy_add_warning(profile));
	}
	function buddy() {
		qs(`.profile_header_actions`).insertAdjacentHTML(`beforeend`, html_elements.profile.buddy_button);

		if (buddy_data.is_buddy()) return is_buddy();
		else return is_not_buddy();

		// If the user is a buddy, update the button to show the buddy status.
		// Add an event listener to allow the user to un-buddy the profile
		function is_buddy() {
			update_buddy();
			qs(`#buddy-button img`).src = chrome.extension.getURL('images/user_slash.png');
			qs(`#buddy-button`).addEventListener(`click`, remove_buddy);

			function remove_buddy() {
				sap_extension.data.user_profiles.buddies.splice(buddy_data.index, 1);
				save_settings();
				window.location.reload(false);
			}
			function update_buddy() {
				sap_extension.data.user_profiles.buddies.splice(buddy_data.index, 1);
				sap_extension.data.user_profiles.buddies.push(profile);
				save_settings();
			}
		}

		function is_not_buddy() {
			qs(`#buddy-button`).addEventListener(`click`, build_overlay);

			function build_overlay() {
				qs(`#sap-buddy-confirm-overlay`).style.display = `flex`;

				qs(`#confirm-buddy`).addEventListener(`click`, add_user_as_buddy); 					// Adds the user to the buddy list & reloads the page
				qs(`#close-buddy`).addEventListener(`click`, close_overlay); 								// Closes the window and does not add them to the buddy list.


			}
			function close_overlay() {
				qs(`#sap-buddy-confirm-overlay`).style.display = `none`;
			}
			function add_user_as_buddy() {
				sap_extension.data.user_profiles.buddies.push(profile);
				save_settings();
				window.location.reload(false);
			}
		}
	}
	function reputation_scanner() {
		const { steamid, personaname } = profile;

		!qs('.profile_customization_area') && qs('.profile_leftcol').insertAdjacentHTML('afterbegin', '<div class="profile_customization_area"></div>'); // If there is not a profile customization area, add it.
		qs('.profile_customization_area').insertAdjacentHTML('afterbegin', html_elements.profile.reputation_panel); // Adds the reputation panel

		const set_elm_value = (args) => { qs('#reputation-panel-' + args.name)[args.type] = args.value; }; // Quickly change the value of an element
		const set_elm_link = (args) => { set_elm_value({ name: args.name, type: 'href', value: args.href }); }; // enhance() with the "type" predefined as "href"

		// Sets the user's data on the reputation panel
		[
			{ name: 'title', type: 'innerText', value: `${personaname}'s SteamRep Reputation` },
			{ name: 'permlink', type: 'innerText', value: `https://steamcommunity.com/profiles/${steamid}` },
			{ name: 'steamid', type: 'value', value: steamid }
		].forEach(set_elm_value);

		// Sets the "resources" links
		[
			{ name: 'reptf', url: 'rep.tf/' },
			{ name: 'backpacktf', url: 'backpack.tf/profiles/' },
			{ name: 'bazaartf', url: 'bazaar.tf/profiles/' },
			{ name: 'scraptf', url: 'scrap.tf/profile/' },
			{ name: 'marketplacetf', url: 'marketplace.tf/shop/' },
			{ name: 'steamiduk', url: 'steamid.eu/profile/' },
			{ name: 'steamtrades', url: 'steamtrades.com/user/' }
		].forEach(args => set_elm_link({
			name: args.name,
			href: 'https://' + args.url + steamid
		}));
		set_elm_link({ name: 'google', href: `https://google.com/search?q="${steamid}"` });    // This link requires a character after the steamid.

		api.reputation.steamrep(steamid) 	// Get the user's reputation
			.then(set_reputation) 					// Set the users reputation on the panel
			.catch(error);

		function set_reputation(reputation_data) {
			// Sets the pending reports area on the panel
			const pending_reports = qs(`#reputation-panel-pendingreports`);
			pending_reports.href = reputation_data.pending_reports_link;
			pending_reports.innerText = `${reputation_data.pending_reports} Pending reports`;
			if (reputation_data.pending_reports > 0) pending_reports.style.color = `#ffe100`;

			const reputation_panel = qs('#reputation-panel-steamrep');
			reputation_panel.href = `https://steamrep.com/profiles/${steamid}`;

			const set_tag = (status, color) => {
				reputation_panel.style.color = color;
				reputation_panel.innerText = reputation_data[status].toString().replace(/\,/g, `, `);
			};

			switch (true) {
				//  If there is a bad tag, display only the bad tag
				case reputation_data.bad_tags.length > 0:
					return set_tag('bad_tags', '#ff4c4c');
				//  If there is no bad tags, display any good ones
				case reputation_data.good_tags.length > 0:
					return set_tag('good_tags', '#26ff00');
				//  If there is no tags at all, display normal text
				default:
					set_elm_value({ name: 'steamrep', type: 'innerText', value: 'Normal' });
			}
		}
		function error(err) {
			alert(`Error getting SteamRep reputation information!\n${err}`);
		}
	}
}
