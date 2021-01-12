qsa(`button`).forEach((button) => button.addEventListener(`click`, button.blur));	// This gets rid of the sticky button effects. 
qsa('.nav_item').forEach((nav_button) => nav_button.addEventListener(`click`, () => switchPage(nav_button)));
qsa(`.btn_toggle`).forEach((button) => button.addEventListener(`click`, () => toggleButton(button)));
qsa(`.settings_container button:not(.btn_toggle):not(.btn_link)`).forEach((button) => button.addEventListener(`click`, () => acceptButton(button)));
qsa();
displaySettingsOnPage();

// Loads our data and updates the page to reflect
async function displaySettingsOnPage() {
	await storage.loadData();

	// Home page statistics
	const { manncostore = [], marketplacetf = [], bitskins = [], backpacktf = [], trusted_users = {} } = sap_data.local;
	const { reputation_detected, impersonators_detected } = sap_data.sync.statistics;

	qs(`#amt_trusted_users`).innerText = Object.keys(trusted_users).length;
	qs(`#amt_bptf_users`).innerText = backpacktf.length;
	qs(`#amt_tradebots`).innerText = manncostore.length + marketplacetf.length + bitskins.length;
	qs(`#amt_impostors`).innerText = Number(impersonators_detected);
	qs(`#amt_reputation`).innerText = Number(reputation_detected);
	qs(`#amt_reputation`).innerText = Number(reputation_detected) + Number(impersonators_detected);

	// Version
	qs(`#extension_version`).innerText = `v${chrome.runtime.getManifest().version}`;

	// Toggle buttons
	Object.keys(sap_data.sync.settings).forEach((setting) => {
		if (sap_data.sync.settings[setting] === false) {
			toggleButton(qs(`[data-setting_name=${setting}]`), true);
		}
	});
}

function switchPage(target) {
	const pages = qsa(`.settings_container .page`);
	const nav_buttons = qsa('.settings_container .nav_item');

	nav_buttons.forEach((nav_button) => nav_button.classList.remove(`active`));
	pages.forEach((page) => page.classList.add(`hidden`));
	qs(`.page#${target.dataset.page_target}`).classList.remove(`hidden`);
	qs(`.nav_item[data-page_target=${target.dataset.page_target}]`).classList.add(`active`);
}

function toggleButton(target, no_change) {
	if (target.classList.contains(`enabled`)) {
		target.classList.remove(`enabled`);
		target.classList.add(`disabled`);
		if (!no_change) updateSetting(target.dataset.setting_name, false);
	}
	else {
		target.classList.add(`enabled`);
		target.classList.remove(`disabled`);
		if (!no_change) updateSetting(target.dataset.setting_name, true);
	}
}

function updateSetting(setting_name, state) {
	sap_data.sync.settings[setting_name] = state;
	storage.save({ sync: sap_data.sync });
}

function acceptButton(target) {
	const original_text = target.innerText;
	const original_color = target.style.color;

	target.disabled = true;
	target.innerText = `✓`;
	target.style.color = `white`;
	setTimeout(() => {
		target.innerText = original_text;
		target.style.color = original_color;
		target.disabled = false;
	}, 2000);
}

function unlockDeveloper() {
	qs(`.nav_item[data-page_target="developer"]`).classList.remove(`hidden`);
}
