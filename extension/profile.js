async function profile() {
	if (!qs(`.profile_header`)) return;	// Check if we are on a valid steam profile page

	//
	// ─── STARTUP ────────────────────────────────────────────────────────────────────
	//
	injectStylesheetToHead(`html/custom_styles/overlay.css`);
	injectStylesheetToHead(`html/custom_styles/profile.css`);
	injectStylesheetToHead(`html/custom_styles/generic.css`);

	const is_not_owner = () => qs(`.profile_header_actions .btn_profile_action`)?.children[0].innerText !== `Edit Profile` || false;
	const profile = {
		personaname: qs(`.profile_header_bg .persona_name .actual_persona_name`)?.innerText,
		profile_picture: qs(`.profile_header_bg .playerAvatar .playerAvatarAutoSizeInner`)?.children[1]?.src || qs(`.profile_header_bg .playerAvatar .playerAvatarAutoSizeInner`)?.children[0]?.src,
		steamid: /7[0-9]{16}/g.exec(/"steamid":"7[0-9]{16}"/g.exec(document.body.innerHTML)[0])[0],
		level: qs(`.profile_header_badgeinfo_badge_area .friendPlayerLevelNum`)?.innerText,
		friends_count: qs(`.profile_friend_links .profile_count_link_total`).innerText,
		buddy_info: {}
	};

	//
	// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────
	//

	// Trusted user system
	if (settingIsEnabled(`profile_trusted_user_system`)) {
		if (!is_not_owner()) return;	// We have no reason to trust ourselves. 
		const trusted_user = await storage.getTrustedUser(profile.steamid);

		if (trusted_user) {

		}
		else {
			injectHTMLElementAsChild(qs(`.profile_header_actions`), html_elements.trust_user_button);
			qs(`#add_user_to_trusted_list`).addEventListener(`click`, () => overlays.confirmTrustToUser({ profile_picture: profile.profile_picture, steamid: profile.steamid, personaname: profile.personaname, level: profile.level, friends: profile.friends_count }));
		}
	}

	// Reputation checker
	if (settingIsEnabled(`profile_reputation`)) {

	}

	// Impersonator checker
	if (settingIsEnabled(`profile_impersonator_scanner`)) {

	}

	// Anon profiles
	if (settingIsEnabled(`dev_anon_profiles`)) {

	}
}

