async function tradeWindow() {
	injectStylesheetToHead(`html/custom_styles/overlay.css`);
	injectStylesheetToHead(`html/custom_styles/tradewindow.css`);
	injectStylesheetToHead(`html/custom_styles/generic.css`);

	const partner = {
		personaname: qsa('.offerheader')[1].childNodes[2].nextSibling.innerText.split("'s items:\nThese are the items you will receive in the trade.")[0],
		steamid: qs('#inventories').children[3].id.split('_')[1],
		profile_picture: qsa('.avatarIcon')[1].childNodes[0].childNodes[0].src.split('.jpg')[0] + '_full.jpg',
		url: qsa('.trade_partner_steam_level_desc,.trade_partner_info_text')[1].childNodes[1].href,
	};

	// Partner reputation
	if (storage.settingIsEnabled('reputation')) {
		const steamrep_rep = await steamrep.getReputation(partner.steamid);
		const trade_area = qs('#trade_area .trade_box_bgheader');

		if (steamrep_rep.is_banned && storage.settingIsEnabled('reputation_overlay')) {
			injectHTMLElementAsChild(trade_area, html_elements.tradeWarning(partner, steamrep_rep.bad_tags), 'afterend');
			qs('#confirm-trade-warning-overlay').addEventListener('click', () => qs('#sap-trade-warning-overlay').remove());
		}
	}

	// Impersonator scanner
	if (storage.settingIsEnabled('impersonator_scanner')) {
		const impersonator_data = await impersonatorScanner(partner);

		log.debug(impersonator_data);

		if (storage.settingIsEnabled('impersonator_overlay') && impersonator_data.impersonator && !impersonator_data.trusted) {
			overlays.impersonatorDetectedOverlay(partner, impersonator_data.profile.profile);
		}
	}
}