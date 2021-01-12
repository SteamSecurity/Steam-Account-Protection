const overlays = {

	confirmTrustToUser: ({ profile_picture, steamid, personaname, level, friends }) => {
		if (!steamid || !personaname || !level) return error(`Steamid, personaname, or level was undefined! \nSteamid: ${steamid}\nPersonaname: ${personaname}\nLevel: ${level}`);

		injectHTMLElementAsChild(qs(`body`), html_elements.trustUser({ profile_picture, steamid, personaname, level, friends }));

		const overlay = qs(`#trust-user-overlay`);
		const close_overlay = qs(`#abort-trust-user`);
		const confirm_overlay = qs(`#confirm-trust-user`);

		setTimeout(() => overlay.classList.add(`not_faded`), 10);
		close_overlay.addEventListener(`click`, () => overlays._closeOverlay(overlay));
		confirm_overlay.addEventListener(`click`, () => console.log(`You would have added a buddy!`));
	},

	_closeOverlay: (overlay) => {
		overlay.classList.remove(`not_faded`);
		setTimeout(() => overlay.remove(), 400);
	}
}