const overlays = {
	bot_impersonator: (profile, impersonated_profile) => {
		document.body.insertAdjacentHTML(`beforebegin`, html_elements.multi.bot_impersonator_warning(profile, impersonated_profile));

		const overlay = qs(`#sap-impersonator-overlay`);
		const close_overlay = qs(`#close-impersonator-overlay`);

		setTimeout(() => html_effects.fade_in(overlay), 1000);
		close_overlay.addEventListener(`click`, () => html_effects.fade_out(overlay));
	}
}