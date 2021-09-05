

// Start functions ------------
qsa(`button`).forEach((button) => button.addEventListener(`click`, button.blur)); // Get rid of sticky buttons
qsa('.nav-link').forEach((nav_link) => nav_link.addEventListener(`click`, () => switchPage(nav_link.dataset.page_target))); // Navigation buttons
qsa(`.menu-button`).forEach((button) => button.addEventListener(`click`, () => toggleButton(button))); // Changing settings
qs(`#extension-version`).innerText = `v${chrome.runtime.getManifest().version}`;	// Display extension version
updateView();

// Functions ------------------
// Update the current view to show current settings
async function updateView() {
	await storage.loadData();

	// Update the Home page stats
	const { manncostore = [], marketplacetf = [], bitskins = [], backpacktf = [], trusted_users = {} } = sap_data.local;
	const { reputation_detected, impersonators_detected } = sap_data.sync.statistics;
	qs(`#amt-trusted-users`).innerText = Object.keys(trusted_users).length;
	qs(`#amt-bptf-users`).innerText = backpacktf.length;
	qs(`#amt-trading-bots`).innerText = manncostore.length + marketplacetf.length + bitskins.length;
	qs(`#amt-impersonators`).innerText = Number(impersonators_detected);
	qs(`#amt-reputation`).innerText = Number(reputation_detected);
	qs(`#amt-threats`).innerText = Number(reputation_detected) + Number(impersonators_detected);

	// Update setting buttons to display their current settings
	Object.keys(sap_data.sync.settings).forEach((setting) => {
		console.log(setting);
		if (sap_data.sync.settings[setting] === false) {
			toggleButton(qs(`[data-setting-name=${setting}]`), true);
		}
	});
}

// Switch the viewed panel to the desired panel
function switchPage(page_target) {
	const all_pages = qsa('.page');
	const all_nav_buttons = qsa('.nav-link');

	all_nav_buttons.forEach((nav_button) => nav_button.classList.remove(`active`));
	all_pages.forEach((page) => page.classList.add(`hidden`));
	qs(`#page-${page_target}`).classList.remove(`hidden`);
	qs(`.nav-link[data-page_target=${page_target}]`).classList.add(`active`);
}

// Toggles settings. Optionally ignores updating the internal setting but defaults to changing it.
function toggleButton(target, no_change) {
	if (target.classList.contains(`enabled`)) {
		target.classList.remove(`enabled`);
		target.classList.add(`disabled`);
		if (!no_change) updateSetting(target.dataset.settingName, false);
	}
	else {
		target.classList.add(`enabled`);
		target.classList.remove(`disabled`);
		if (!no_change) updateSetting(target.dataset.settingName, true);
	}

	// Changes the internal setting
	function updateSetting(setting_name, state) {
		console.log(sap_data);
		sap_data.sync.settings[setting_name] = state;
		storage.save({ sync: sap_data.sync });
	}
}

// Developer functionality. Enter in console to unlock!
function unlockDeveloper() {
	qs(`.nav-link[data-page_target="dev"]`).classList.remove(`hidden`);
}