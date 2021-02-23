const overlays = {

	confirmTrustToUser: (profile) => {
		overlays._openOverlay('trustUser', { profile });

		const confirm_overlay = qs(`#confirm-trustUser`);
		confirm_overlay.addEventListener(`click`, () => {
			storage.addTrustedUser(profile);
			window.location.reload();
		});
	},

	reputationWarningOverlay: (profile, reputation) => {
		const addBannedCommunity = (text) => qs('#reputation-overlay .reputation_box').insertAdjacentHTML('beforeend', `<div class="community_ban_report">${text}</div>`);

		overlays._openOverlay('reputation', { profile, reputation });

		if (reputation.bad_tags.length > 0) addBannedCommunity('SteamRep Banned');
		if (reputation.steam_bans.vac.summary === 'Banned') addBannedCommunity('VAC Banned'); // Is there a need to check for VAC bans?
		if (reputation.steam_bans.trade.summary === 'Trade Ban') addBannedCommunity('Trade Banned');
	},

	impersonatorDetectedOverlay: (profile, impersonated_profile) => {
		overlays._openOverlay('impersonator', { profile, impersonated_profile });
	},

	_openOverlay: (overlay_name, overlay_data = {}) => {
		const body = qs('body');

		injectHTMLElementAsChild(qs(`body`), html_elements[overlay_name](overlay_data), 'beforebegin');

		const overlay = qs(`#${overlay_name}-overlay`);
		const close_overlay = qs(`#close-${overlay_name}-overlay`);

		close_overlay.focus();
		close_overlay.addEventListener(`click`, () => overlays._closeOverlay(overlay_name));
		setTimeout(() => overlay.classList.add(`not_faded`), 10);
		setTimeout(() => body.classList.add('zoned_out'), 30);
	},

	_closeOverlay: (overlay_name) => {
		const body = qs('body');
		const overlay = qs(`#${overlay_name}-overlay`);

		overlay.classList.remove(`not_faded`);
		body.classList.remove('zoned_out');

		setTimeout(() => overlay.remove(), 400);
	}
}