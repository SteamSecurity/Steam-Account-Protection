const overlays = {
	impersonator: (profile, impersonated_profile) => {
		document.body.insertAdjacentHTML(`beforebegin`, html_elements.multi.impersonator_warning(profile, impersonated_profile));

		const overlay = qs(`#sap-impersonator-overlay`);
		const close_overlay = qs(`#close-impersonator-overlay`);

		setTimeout(() => html_effects.fade_in(overlay), 1000);
		close_overlay.addEventListener(`click`, () => html_effects.fade_out(overlay));
	},
	reputation: () => {
		document.body.insertAdjacentHTML(`beforebegin`, html_elements.multi.reputation_warning());

		const overlay = qs(`#sap-reputation-overlay`);
		const close_overlay = qs(`#close-reputation-overlay`);

		setTimeout(() => html_effects.fade_in(overlay), 1000);
		close_overlay.addEventListener(`click`, () => html_effects.fade_out(overlay));
	}
}