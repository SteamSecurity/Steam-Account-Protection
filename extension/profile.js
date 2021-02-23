async function profile() {
	if (!qs(`.profile_header`)) return;	// Check if we are on a valid steam profile page
	injectStylesheetToHead(`html/custom_styles/overlay.css`);
	injectStylesheetToHead(`html/custom_styles/profile.css`);
	injectStylesheetToHead(`html/custom_styles/generic.css`);

	const is_not_owner = () => qs(`.profile_header_actions .btn_profile_action`)?.children[0].innerText !== `Edit Profile` || false;
	const profile = {
		personaname: qs(`.profile_header_bg .persona_name .actual_persona_name`).innerText,
		profile_picture: qs(`.profile_header_bg .playerAvatar .playerAvatarAutoSizeInner`)?.children[1]?.src || qs(`.profile_header_bg .playerAvatar .playerAvatarAutoSizeInner`)?.children[0]?.src,
		steamid: /7[0-9]{16}/g.exec(/"steamid":"7[0-9]{16}"/g.exec(document.body.innerHTML)[0])[0] || undefined,
		level: qs(`.profile_header_badgeinfo_badge_area .friendPlayerLevelNum`)?.innerText || undefined,
		friends_count: qs(`.profile_friend_links .profile_count_link_total`)?.innerText || undefined,
		status: qs('.profile_in_game_header')?.innerText || '',
		status_summary: qs('.profile_in_game_name')?.innerText || '',
		lobby: {
			can_join: qs('.profile_in_game_joingame') || false,
			link: qs('.profile_in_game_joingame a')?.href || null
		}
	};

	// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────

	injectHTMLElementAsChild(qs(`.profile_rightcol`), html_elements.profileReputation(profile), `afterbegin`);
	setTimeout(() => qs(`#sap_reputation_panel`).classList.add(`slide_down`), 100);

	// Trusted user system
	if (storage.settingIsEnabled(`profile_trusted_user_system`) && is_not_owner()) {
		const trusted_user = await storage.getTrustedUser(profile.steamid);
		const profile_button_container = qs(`.profile_header_actions`);

		if (trusted_user) {
			injectHTMLElementAsChild(profile_button_container, html_elements.untrust_user_button);
			qs(`#untrust_user`).addEventListener(`click`, () => { storage.removeTrustedUser(profile.steamid); window.location.reload(); });
		}
		else {
			injectHTMLElementAsChild(profile_button_container, html_elements.trust_user_button);
			qs(`#add_user_to_trusted_list`).addEventListener(`click`, () => overlays.confirmTrustToUser(profile));
		}
	}

	// Reputation checker & Reputation panel
	if (storage.settingIsEnabled(`profile_reputation`)) {
		const addDescriptorToReputationPanel = (title, descriptor_class, summary) => { injectHTMLElementAsChild(qs('#sap_reputation_panel .disclaimer'), `<div class="descriptor ${descriptor_class}">${title}: <div>${summary}</div></div>`, `afterend`); };
		const steamrep_rep = await steamrep.getReputation(profile.steamid);
		const account_age_element = qs('#account_age');

		qs('#reputation_header').classList.remove('hidden');
		account_age_element.innerHTML = steam.getAccountAgeString(steamrep_rep.account_creation_date);
		account_age_element.parentElement.classList.remove('hidden');

		injectHTMLElementAsChild(qs('#sap_reputation_panel .disclaimer'), `<br>`, `afterend`);
		addDescriptorToReputationPanel('Trade', steamrep_rep.steam_bans.trade.class, steamrep_rep.steam_bans.trade.summary);
		addDescriptorToReputationPanel('VAC', steamrep_rep.steam_bans.vac.class, steamrep_rep.steam_bans.vac.summary);
		addDescriptorToReputationPanel('Reputation', steamrep_rep.summary.class, steamrep_rep.summary.summary);

		// Allows you to one click the perm steam profile link and copy it to the clipboard.
		const copy_steamid_textbox = qs('#copy_steam_perm_link');
		const steamid_textbox = qs('#steamid_textbox');
		copy_steamid_textbox.addEventListener('click', () => copyTextInput(steamid_textbox, copy_steamid_textbox));

		if (storage.settingIsEnabled('profile_reputation_overlay')) {
			if (steamrep_rep.is_banned)
				overlays.reputationWarningOverlay(profile, steamrep_rep);
		}
	}

	// Impersonator checker
	if (storage.settingIsEnabled(`profile_impersonator_scanner`)) {
		const impersonator_data = await impersonatorScanner(profile);
		const disclaimer = qs('#sap_reputation_panel .disclaimer');

		if (impersonator_data.trusted) {
			disclaimer.classList.remove('hidden');
			disclaimer.classList.add('trusted');
			disclaimer.innerText = impersonator_data.summary;
		}
		else if (impersonator_data.impersonator) {
			disclaimer.classList.remove('hidden');
			disclaimer.classList.add('banned');
			disclaimer.innerText = 'Impersonator';

			if (storage.settingIsEnabled('profile_impersonator_overlay')) {
				overlays.impersonatorDetectedOverlay(profile, impersonator_data.profile.profile);
			}
		}
	}

	// Anon profiles
	if (storage.settingIsEnabled(`dev_anon_profiles`)) {
		const page_body = qs('body');
		const level_number = Math.floor((Math.random() * 100) + 5);
		const random_level = { level: level_number, class: `friendPlayerLevel ${steam.getLevelClassName(level_number)}` };

		qs('.actual_persona_name').innerText = 'User';
		qs('.playerAvatarAutoSizeInner').children[0].src = 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/7e/7edbe3862db4763224111b8fe77d94d5bf3f287c_full.jpg';
		qs('.header_real_name.ellipsis').children[0].innerText = '';

		qs('.friendPlayerLevelNum').innerText = random_level.level;
		qs('.friendPlayerLevel').className = random_level.class;

		qs('.profile_summary.noexpand').innerText = '';

		page_body.insertAdjacentHTML('beforebegin', '<style>.profile_customization {display:none;} .recent_game_content{display:none;} .favorite_badge{display:none;} .commentthread_comment_container {display:none;} .profile_count_link_preview{display:none;} .profile_badges, .profile_item_links, .profile_group_links, .profile_friend_links {margin-bottom:0px}</style>');
		qs('.commentthread_allcommentslink span').innerHTML = '';
		qsa('.commentthread_pagelinks').forEach((page_nm_elem) => page_nm_elem.innerHTML = '1 2 4 3');

		// Levels, Groups, and friends
		qsa('.profile_count_link_total').forEach((pclt_elem) => pclt_elem.innerText = Math.floor((Math.random() * 225) + 1));
		page_body.innerHTML = page_body.innerHTML.replaceAll(profile.steamid, '76561198100000000');
		page_body.innerHTML = page_body.innerHTML.replaceAll(document.querySelectorAll('.persona_name_text_content')[2].innerText, 'Me');
		page_body.innerHTML = page_body.innerHTML.replaceAll(document.querySelectorAll('.persona_name_text_content')[2].innerText.toUpperCase(), 'ME');
	}
}

