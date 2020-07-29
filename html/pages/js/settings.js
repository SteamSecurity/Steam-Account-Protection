// TODO: Make requests to update bot and user profile data
var sap_extension;
storage.get_settings()
	.then((response) => sap_extension = response)
	.then(display_settings)
	.then(event_listeners);

/* ------------------------- Handle Navigation Tabs ------------------------- */
const navigation_tabs = qsa('.navigation a');
navigation_tabs.forEach((tab) => create_click_event(tab));

chrome.runtime.sendMessage({ "icon_path": 'img/sap_good.png' });		// We trust this site

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

/* ----------------------------- Event listeners ---------------------------- */
function event_listeners() {
	// Setting buttons
	qsa(`.text .button`).forEach((button) => setting_button(button));

	// Builds the buddy overlay
	qs(`#btn-view-buddies`).addEventListener(`click`, build_buddy_overlay);
	qs(`#close-buddy`).addEventListener(`click`, close_buddy_overlay);
	qs(`#sap-buddy-overlay .search`).addEventListener(`keyup`, search_buddy);
}

// Settings
function setting_button(button) {
	if (!button.dataset.category || !button.dataset.setting) return;
	button.addEventListener(`click`, () => toggle_setting(button.dataset.category, button.dataset.setting));
}
function toggle_setting(category, setting) {
	sap_extension.settings[category][setting] = !sap_extension.settings[category][setting];
	storage.save_settings();
	display_settings();
}
function display_settings() {
	const get_button = (name) => qs(`.text #setting-${name}`);
	const get_classlist = (category, setting) => {
		const is_enabled = (category, setting) => sap_extension.settings[category][setting];
		if (is_enabled(category, setting)) return `button btn_good`;
		else return `button btn_bad`;
	};

	// Profile
	get_button(`buddy-system`).classList = get_classlist(`profile`, `buddy_button`);
	get_button(`reputation-panel-profile`).classList = get_classlist(`profile`, `pr_reputation_scanner`);
	get_button(`impersonator-checker-profile`).classList = get_classlist(`profile`, `pr_impersonator_scanner`);

	// Trading
	get_button(`api-warning`).classList = get_classlist(`trade_window`, `api_warning`);
	get_button(`reputation-checker-trade`).classList = get_classlist(`trade_window`, `tw_reputation_scanner`);
	get_button(`impersonator-checker-trade`).classList = get_classlist(`trade_window`, `tw_impersonator_scanner`);
}

// Buddy overlay
function build_buddy_overlay() {
	const overlay = qs(`#sap-buddy-overlay`);
	const buddies = sap_extension.data.user_profiles.buddies;
	const injection_target = qs(`#sap-buddy-overlay .overlay-content`).children[2];

	qs(`#sap-buddy-overlay .search`).value = "";		// Clear the search bar

	html_effects.fade_in(overlay);
	buddies.forEach((buddy) => {
		injection_target.insertAdjacentHTML(`afterend`, html_elements.settings.buddy_container(buddy));
		const buttons = qsa(`#sap-buddy-overlay .profile-container .button-container .button`);

		buttons.forEach((button) => button.addEventListener(`click`, () => buddy_function_click(button.dataset.function, button)));
	});
}
function search_buddy() {
	const buddies = qsa(`#sap-buddy-overlay .profile-container`);
	const search = qs(`#sap-buddy-overlay .search`).value;

	buddies.forEach((buddy) => {
		const persona = buddy.children[1].children[0].innerText.replace(`Persona:\n`, ``).trim().toLowerCase();
		const steamid = buddy.children[1].children[2].innerText.replace(`SteamID:\n`, ``).trim();

		if (persona.includes(search.toLowerCase())) return buddy.classList.remove(`hidden`);
		if (steamid.includes(search)) return buddy.classList.remove(`hidden`);

		buddy.classList.add(`hidden`);
	});
}
function buddy_function_click(type, button) {
	if (type === `remove_buddy`) return remove_buddy(button.parentElement.parentElement.parentElement, button.dataset.target);
}
function remove_buddy(buddy_listing, steamid) {
	let buddy = storage.find_buddy(steamid);
	if (buddy.index === -1) return;

	buddy_listing.remove();
	sap_extension.data.user_profiles.buddies.splice(buddy.index, 1);
	storage.save_settings();
}
function close_buddy_overlay() {
	const overlay = qs(`#sap-buddy-overlay`);
	const buddy_containers = qsa(`#sap-buddy-overlay .profile-container`);

	html_effects.fade_out(overlay);
	buddy_containers.forEach((container) => container.remove());
}