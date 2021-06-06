qsa(`button`).forEach((button) => button.addEventListener(`click`, button.blur));	// This gets rid of the sticky button effects. 
qsa('.nav_item').forEach((nav_button) => nav_button.addEventListener(`click`, () => switchPage(nav_button)));
qsa(`.btn_toggle`).forEach((button) => button.addEventListener(`click`, () => toggleButton(button)));
qsa(`.settings-container button:not(.btn_toggle):not(.btn_link):not(.link)`).forEach((button) => button.addEventListener(`click`, () => acceptButton(button)));
qsa('.panel-button').forEach((button) => button.addEventListener('click', () => switchPanel(button.dataset.panel_target, button.dataset.callback)));
displaySettingsOnPage();


let backpacktf_data_loaded = false;
let tradingbot_data_loaded = false;
let trusted_data_loaded = false;


// TODO: Notification for updating reference data
// TODO: Save trusted user trusted date

qs('#upd_reference_data').addEventListener('click', () => storage.getNewReferenceData());

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
	qs(`#amt_threats`).innerText = Number(reputation_detected) + Number(impersonators_detected);

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
	const pages = qsa(`.settings-container .page`);
	const nav_buttons = qsa('.settings-container .nav_item');

	nav_buttons.forEach((nav_button) => nav_button.classList.remove(`active`));
	pages.forEach((page) => page.classList.add(`hidden`));
	qs(`.page#${target.dataset.page_target}`).classList.remove(`hidden`);
	qs(`.nav_item[data-page_target=${target.dataset.page_target}]`).classList.add(`active`);
}

function switchPanel(target, callback) {
	const target_page = qs(`#${target}`);
	const all_pages = qsa('.settings-container');
	all_pages.forEach((page) => {
		page.classList.add('hidden');
	});
	target_page.classList.remove('hidden');
	window[callback]();
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

	if (setting_name === 'reputation_overlay' && state == false) { }
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

async function loadBackpacktfReferenceData() {
	if (backpacktf_data_loaded) return;
	backpacktf_data_loaded = true;
	await storage.loadData();
	const parent = qs('#backpacktf-reference-data .container');
	const backpacktf_data = sap_data.local.backpacktf;

	for (user of backpacktf_data) {
		const template = qs('#backpacktf-user-template').content.cloneNode(true);
		template.querySelector('div img').src = user.avatar;
		template.querySelector('[data-type="persona"]').innerText = user.personaname;
		template.querySelector('[data-type="steamid"]').innerText = user.steamid;
		template.querySelector('[data-type="profilelink"]').href = `https://steamcommunity.com/profiles/${user.steamid}`;

		parent.append(template);
	}
}
async function loadTradingBotReferenceData() {
	if (tradingbot_data_loaded) return;
	tradingbot_data_loaded = true;

	await storage.loadData();
	const marketplace = sap_data.local.marketplacetf;
	const manncostore = sap_data.local.manncostore;
	const bitskins = sap_data.local.bitskins;

	marketplace.forEach((steamid) => addTradingBot('#marketplacetf-reference-container', steamid, "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c50215efc86d85386d4e963589c175a48e74a647_full.jpg"));
	manncostore.forEach((steamid) => addTradingBot('#manncostore-reference-container', steamid, "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/4b/4b2b43c016a3fa7d915f99df1ef9436b7ad4a0ad_full.jpg"));
	bitskins.forEach((steamid) => addTradingBot('#bitskins-reference-container', steamid, "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/8d/8dcad7f2f549bb502bc7268dc476ddb3ff3d04df_full.jpg"));

	qsa('.user-data.reference-data-header.user-data-header').forEach((category) => category.addEventListener('click', () => { toggleVisibility(qs(`#${category.dataset.referenceTarget}-reference-container`)); }));

	function toggleVisibility(element) {
		console.log(element.classList);
		if (element.classList.contains('hidden')) {
			element.classList.remove('hidden');
		} else {
			element.classList.add('hidden');
		}
	}

	function addTradingBot(location, steamid, profile_picture) {
		const parent = qs(location);
		const template = qs('#tradingbot-user-template').content.cloneNode(true);
		template.querySelector('div img').src = profile_picture;
		template.querySelector('[data-type="steamid"]').innerText = steamid;
		template.querySelector('[data-type="profilelink"]').href = `https://steamcommunity.com/profiles/${steamid}`;

		parent.append(template);
	}
}