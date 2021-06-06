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
		if (reputation.steam_bans.vac.summary === 'Banned') reputation.bad_tags.push('VAC Banned');
		if (reputation.steam_bans.trade.summary === 'Trade Ban') reputation.bad_tags.push('Trade Banned');

		overlays._openOverlay('reputation', { profile: profile, reputation: reputation });
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