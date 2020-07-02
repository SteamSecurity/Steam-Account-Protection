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
	if (sap_extension.settings.profile.pr_reputation_scanner) reputation_scanner(); 						// Scan the user`s reputation and display it
	if (sap_extension.settings.profile.pr_impersonator_scanner) impersonator_scanner(profile); 	// Checks if the user is a potential impersonator

	/* -------------------------------- Functions ------------------------------- */
	function load_custom_content() {
		// Stylesheets
		qs(`head`).insertAdjacentHTML(`beforeend`, `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(`html/elements/profile/css/overlay.css`)}">`);
		qs(`head`).insertAdjacentHTML(`beforeend`, `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(`html/stylesheets/profile.css`)}">`);
	}
	function buddy() {
		qs(`.profile_header_actions`).insertAdjacentHTML(`beforeend`, html_elements.profile.buddy_button);
		qs(`body`).insertAdjacentHTML(`beforebegin`, html_elements.profile.buddy_add_warning(profile));

		if (buddy_data.is_buddy()) return is_buddy();
		else return is_not_buddy();

		// If the user is a buddy, update the button to show the buddy status.
		// Add an event listener to allow the user to un-buddy the profile
		function is_buddy() {
			update_buddy();
			qs(`#buddy-button img`).src = chrome.extension.getURL(`images/user_slash.png`);
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
		!qs(`.profile_customization_area`) && qs(`.profile_leftcol`).insertAdjacentHTML(`afterbegin`, `<div class="profile_customization_area"></div>`); // If there is not a profile customization area, add it.
		qs(`.profile_customization_area`).insertAdjacentHTML(`afterbegin`, html_elements.profile.reputation_panel(profile)); // Adds the reputation panel

		api.reputation.steamrep(profile.steamid)
			.then(set_reputation)
			.catch(error);

		const pending_reports = qs(`#reputation-panel-pendingreports`);
		const reputation_panel = qs(`#reputation-panel-steamrep`);
		const set_tag = (text, color) => {
			if (color) reputation_panel.classList.add(color);
			reputation_panel.innerText = text;
		};

		function set_reputation(reputation_data) {
			pending_reports.href = reputation_data.pending_reports_link;
			pending_reports.innerText = `${reputation_data.pending_reports} Pending reports`;

			if (reputation_data.pending_reports > 0) pending_reports.classList.add(`sap-warning`);		// Sets the warning color if there are more than 0 reports,

			// Set the tags of the user
			if (reputation_data.bad_tags.length > 0) return set_tag(reputation_data.bad_tags.toString().replace(/\,/g, `, `), `sap-critical`);
			if (reputation_data.good_tags.length > 0) return set_tag(reputation_data.good_tags.toString().replace(/\,/g, `, `), `sap-good`);
			return set_tag(`Normal`);
		}
		function error() {
			set_tag(`Error`, `sap-warning`);
			pending_reports.innerText = `Error`;
			pending_reports.classList.add(`sap-warning`);
		}
	}
}
