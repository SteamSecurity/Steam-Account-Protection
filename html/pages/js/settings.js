var sap_extension;
storage.get_settings()
	.then((response) => sap_extension = response)
	.then(display_settings)
	.then(event_listeners);

/* ------------------------- Handle Navigation Tabs ------------------------- */
const navigation_tabs = qsa('.navigation a');
navigation_tabs.forEach((tab) => create_click_event(tab));

function create_click_event(selected_tab) {
	selected_tab.addEventListener(`click`, () => {
		// Hide all tabs and tab content
		navigation_tabs.forEach((tab) => {
			tab.classList.remove(`active`);	// Removes class "active" from all navigation tabs
			qs(`#content-${tab.dataset.content}`).classList.add(`hidden`);
		});

		// Show selected tab content
		selected_tab.classList.add(`active`);
		qs(`#content-${selected_tab.dataset.content}`).classList.remove(`hidden`);
	});
}

/* -------------------------------- Settings -------------------------------- */
// Change settings
function event_listeners() {
	// This toggles the main settings. Such as the API warning and Impersonator checkers
	qsa(`.text .button`).forEach((button) => {
		if (!button.dataset.category || !button.dataset.setting) return;
		button.addEventListener(`click`, () => toggle_setting(button.dataset.category, button.dataset.setting));
	});
	function toggle_setting(category, setting) {
		sap_extension.settings[category][setting] = !sap_extension.settings[category][setting];
		storage.save_settings();
		display_settings();
	}

	// Builds the buddy overlay
	qs(`#btn-view-buddies`).addEventListener(`click`, () => build_buddy_overlay());
	qs(`#close-buddy`).addEventListener(`click`, () => close_buddy_overlay());

	// Searching for the buddy overlay
	qs(`#sap-buddy-overlay .search`).addEventListener(`keyup`, () => {
		const buddies = qsa(`#sap-buddy-overlay .profile-container`);
		const search = qs(`#sap-buddy-overlay .search`).value;

		buddies.forEach((buddy) => {
			const persona = buddy.children[1].children[0].innerText.replace(`Persona:\n`, ``).trim().toLowerCase();
			const steamid = buddy.children[1].children[2].innerText.replace(`SteamID:\n`, ``).trim();

			if (persona.includes(search.toLowerCase())) return buddy.classList.remove(`hidden`);
			if (steamid.includes(search)) return buddy.classList.remove(`hidden`);

			buddy.classList.add(`hidden`);
		});
	});
}

// Display current settings
function display_settings() {
	const get_button = (name) => qs(`.text #setting-${name}`);
	const get_classlist = (category, setting) => {
		const is_enabled = (category, setting) => sap_extension.settings[category][setting];
		if (is_enabled(category, setting)) return `button btn_enable`;
		else return `button btn_disable`;
	};

	// Profile
	get_button(`buddy-system`).classList = get_classlist(`profile`, `buddy_button`);
	get_button(`reputation-panel-profile`).classList = get_classlist(`profile`, `pr_reputation_scanner`);
	get_button(`impersonator-checker-profile`).classList = get_classlist(`profile`, `pr_impersonator_scanner`);

	// Trading
	get_button(`api-warning`).classList = get_classlist(`trade_window`, `api_warning`);
	get_button(`trading-toolbar`).classList = get_classlist(`trade_window`, `trade_toolbar`);
	get_button(`reputation-checker-trade`).classList = get_classlist(`trade_window`, `tw_reputation_scanner`);
	get_button(`impersonator-checker-trade`).classList = get_classlist(`trade_window`, `tw_impersonator_scanner`);
}

/* ------------------------------ Buddy overlay ----------------------------- */
function build_buddy_overlay() {
	qs(`#sap-buddy-overlay`).classList.remove(`hidden`);
	const buddies = sap_extension.data.user_profiles.buddies;
	const injection_target = qs(`#sap-buddy-overlay .overlay-content`).children[2];
	buddies.forEach((buddy) => {
		injection_target.insertAdjacentHTML(`afterend`, html_elements.settings.buddy_container(buddy));
		const buttons = qsa(`#sap-buddy-overlay .profile-container .button-container .button`);
		buttons.forEach((button) => {
			button.addEventListener(`click`, () => {
				if (button.dataset.function === `remove_buddy`) remove_buddy(button.parentElement.parentElement.parentElement, button.dataset.target);
			});
		});
	});
}
function remove_buddy(buddy_listing, steamid) {
	let buddy = storage.find_buddy(steamid);
	if (buddy.index === -1) return;

	console.log(buddy.index);
	sap_extension.data.user_profiles.buddies.splice(buddy.index, 1);
	buddy_listing.remove();
	storage.save_settings();
}

function search_buddy() {
	qs(`#sap-buddy-overlay .search`).addEventListener(`keyup`, () => {
		const buddies = qsa(`#sap-buddy-overlay .profile-container`);
		const search = qs(`#sap-buddy-overlay .search`).innerText;
		buddies.forEach((buddy) => {
			if (buddy.children[1].children[0].innerText.includes(search)) return buddy.classList.remove(`hidden`);
			if (buddy.children[1].children[2].innerText.includes(search)) return buddy.classList.remove(`hidden`);
			buddy.classList.add(`hidden`);
		});
	});
}

function close_buddy_overlay() {
	qs(`#sap-buddy-overlay`).classList.add(`hidden`);
	const buddy_containers = qsa(`#sap-buddy-overlay .profile-container`);
	buddy_containers.forEach((container) => container.remove());
}