function trade_window() {
	var trade_window_data = {
		partner: {
			personaname: document.querySelectorAll('.offerheader')[1].childNodes[2].nextSibling.innerText.split("'s items:\nThese are the items you will receive in the trade.")[0],
			steamid: document.querySelector('#inventories').children[3].id.split('_')[1],
			profile_picture: document.querySelectorAll('.avatarIcon')[1].childNodes[0].childNodes[0].src.split('.jpg')[0] + '_full.jpg',
			url: document.querySelectorAll('.trade_partner_steam_level_desc,.trade_partner_info_text')[1].childNodes[1].href,
			level: document.querySelectorAll('.trade_partner_info_text')[2].innerText.replace('has a Steam Level of ', '')
		},
		buddy_data: {
			profile_information: {},
			index: -1,
			is_buddy: () => trade_window_data.buddy_data.index !== -1
		}
	};

	// Checks if the page is a valid trade window (One that is active and can be acted upon)
	if (!is_trade_window()) {
		return;
	}
	// Get Buddy data ==================================
	sap_extension.data.user_profiles.buddies.find((buddy, index) => {
		if (buddy.steamid === profile_data.user.steamid) {
			profile_data.buddy_data.profile_information = buddy;
			profile_data.buddy_data.index = index;
			return;
		}
	});

	// Inject our html
	handle_html();

	if (sap_extension.settings.trade_window.api_warning) {
		api_warning();
	}
	if (sap_extension.settings.trade_window.trade_toolbar) {
		trade_toolbar();
	}

	if (sap_extension.settings.trade_window.tw_reputation_scanner) {
		reputation_scanner();
	} else {
		if (document.querySelector(`#trade-toolbar`)) {
			document.querySelector(`#trade-toolbar-disabled-notice`).style.display = `block`;
		}
	}

	if (sap_extension.settings.trade_window.tw_impersonator_scanner) {
		if (!trade_window_data.buddy_data.is_buddy()) {
			impersonator_scanner(trade_window_data.partner);
		}
	}

	// Load Stylesheets files ==========================
	function handle_html() {
		document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(`html/stylesheets/trade_window.css`)}">`);
		document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `<script src="https://steamcommunity-a.akamaihd.net/public/shared/css/shared_global.css?v=O5W-K8wVvTcv"></script>`);
	}

	// API Key =========================================
	async function api_warning() {
		if ((await xhr_send(`get`, `https://steamcommunity.com/dev/apikey`)).includes(`Key: `)) {
			document.querySelector(`.trade_partner_header`).lastChild.remove();
			document.querySelector(`.trade_partner_header`).insertAdjacentHTML(`beforeend`, html_elements.trade_window.api_warning);
			document.querySelector(`.trade_partner_header`).insertAdjacentHTML(`beforeend`, `<div style="clear:left;"></div>`);
		}
	}

	// Trade Toolbar ====================================
	function trade_toolbar() {
		// Inject the Trade Toolbar
		document.querySelector(`.trade_partner_header`).lastChild.remove();
		document.querySelector(`.trade_partner_header`).insertAdjacentHTML(`beforeend`, html_elements.trade_window.trade_toolbar);
		document.querySelector(`.trade_partner_header`).insertAdjacentHTML(`beforeend`, `<div style="clear:left;"></div>`);

		// Add listeners to the buttons
		document.querySelectorAll(`#trade-toolbar .bpanel`).forEach((button_element) => {
			button_element.addEventListener(`click`, () => {
				open_trade_toolbar_box(button_element.id.split(`-`)[3]);
			});
		});

		// Add listener to the backpack.tf button - This opens a new window
		document.querySelector(`#trade-toolbar-open-backpacktf`).addEventListener(`click`, () => {
			window.open(
				`${chrome.extension.getURL('html/elements/trade_window/pop_ups/backpacktf_popup.html')}?steamid=${trade_window_data.partner.steamid}&profile_picture=${trade_window_data.partner.profile_picture}`,
				null,
				'width=300, height=630, resizable=0, menubar=no',
				true
			);
		});

		// When a button is clicked, open its panel
		function open_trade_toolbar_box(box) {
			// If the panel is open, close it
			if (!document.querySelector(`#trade-toolbar-${box}`).classList.contains(`invisible`)) {
				document.querySelector(`#trade-toolbar-${box}`).classList.add('invisible');
				return;
			}

			// Otherwise, nuke all of the panels...
			document.querySelectorAll(`.trade-toolbar-info-box`).forEach((element) => {
				if (!element.classList.contains(`invisible`)) {
					element.classList.add(`invisible`);
				}
			});
			// ... and open the selected one
			document.querySelector(`#trade-toolbar-${box}`).classList.remove('invisible');
		}
	}

	// Reputation scanner ===============================
	async function reputation_scanner() {
		api.reputation.reptf(trade_window_data.partner.steamid).then(to_array).then(display_rep);

		// Formats the reputation into something we can more easily use
		function to_array(rep_object) {
			let rep_array = [];
			Object.keys(rep_object.bans).forEach((community) => {
				let new_object = {};
				new_object[community] = rep_object.bans[community];
				rep_array.push(new_object);
			});
			return rep_array;
		}

		function display_rep(rep_array) {
			rep_array.forEach((rep_object) => {
				let community_name = Object.keys(rep_object)[0];

				if (rep_object[community_name].banned === true) {
					// Reputation popup ====================
					// If the trade window does not exist, create it
					if (!document.querySelector(`#reputation-warning`)) {
						document.querySelector(`body`).insertAdjacentHTML(`beforebegin`, html_elements.trade_window.reputation_warning);
						document.querySelector(`#reputation-warning-close`).addEventListener(`click`, () => document.querySelector(`#reputation-warning`).parentElement.remove());
					}
					document.querySelector(`#rep-${community_name}`).style.opacity = `1`; // Give it full opacity so we can see it
					document.querySelector(`#rep-${community_name}`).title = `Banned!`;

					// Trade Toolbar =======================
					// If the trade toolbar exists, add the banned community to the panel
					if (document.querySelector(`#trade-toolbar`)) {
						document.querySelector(`#trade-toolbar-rep-${community_name}`).style.opacity = `1`; // Give it full opacity so we can see it
						document.querySelector(`#trade-toolbar-rep-${community_name}`).title = `Banned!`;
						document.querySelector(`#trade-toolbar-warning-community-bans`).style.display = `block`;
					}
				}
			});
		}
	}
}

// If these two elements exist, the trade window is valid
function is_trade_window() {
	if (document.getElementsByClassName('offerheader')[1] && document.getElementsByClassName('avatarIcon')[1]) {
		return true;
	}
}
