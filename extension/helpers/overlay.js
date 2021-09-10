const overlays = {
	confirmTrustToUser: (profile) => {
		overlays._createOverlay({ title: 'TRUST USER', body_text: `Are you sure you want to trust ${profile.personaname}?`, type: 'generic', buttons: [{ text: 'Confirm', action: 'confirm', class: 'good' }, { text: 'Cancel', action: 'close', class: 'bad' }] });

		qs(`#trustuser .confirm`).addEventListener(`click`, () => {
			storage.addTrustedUser(profile);
			window.location.reload();
		});
	},

	reputationWarningOverlay: (profile, reputation) => {
		// Adds a notice to the overlay. Only negative tags should be added
		const addReputationNotice = (reputation) => overlay_body.insertAdjacentHTML(`beforeend`, `<div class='warning'>${reputation}</div>`);

		overlays._createOverlay({ title: 'REPUTATION WARNING', body_text: `${profile.personaname} has the following warnings`, type: 'generic', buttons: [{ text: 'Continue', action: 'close' }] });
		reputation.bad_tags.forEach(addReputationNotice);
	},

	impersonatorDetectedOverlay: (profile, impersonated_profile) => {
		let overlay = overlays._createOverlay({ title: 'IMPERSONATOR WARNING', type: 'side-by-side', buttons: [{ text: 'Continue', action: 'close' }] });
		const overlay_body = overlay.querySelector('#impersonatorwarning .overlay-body');

		overlay_body.insertAdjacentHTML('beforeend', createProfileListingHTML(profile, { header: 'Current Profile', alert: true }));
		overlay_body.insertAdjacentHTML('beforeend', createProfileListingHTML(impersonated_profile, { header: 'Impersonated' }));

		function createProfileListingHTML(profile_object, { alert, header } = {}) {
			return `
			<div class='profile-container${alert ? ' alert' : ''}'>
			${header ? `<div class='header'>${header}</div>` : ''}
			<div class='profile-picture'><img src='${profile_object.profile_picture}'></div>
			<div class='sub-title'>Persona:</div>
			<div class='profile-item'>${profile_object.personaname}</div>
			<div class='sub-title'>SteamID:</div>
			<div class='profile-item'>${profile_object.steamid}</div>
			</div>
			`;
		}
	},

	saveProfileData: (profile_data) => {
		let overlay = overlays._createOverlay({ title: 'SAVE USER DATA', type: 'side-by-side', footer_text: 'This will overwrite any previously saved profile data', buttons: [{ text: 'Save', class: 'good', action: 'save' }, { text: 'Cancel', class: 'bad', action: 'close' }] });
		const overlay_body = overlay.querySelector('.overlay-body');

		overlay_body.innerHTML = createBodyOverlay();
		overlay.querySelector('.save').addEventListener('click', () => saveProfileData());

		function createBodyOverlay() {
			return `
				<div class='text-center'><div class='sub-title'>Personaname:</div><div class=''>${profile_data.personaname}</div></div>
				<div class='text-center'><div class='sub-title'>Custom URL:</div><div class=''>${profile_data.custom_url}</div></div>
				<div class='text-center'><div class='sub-title'>Real Name:</div><div class=''>${profile_data.real_name}</div></div>
				<div class='text-center'><div class='sub-title'>Summary Chars:</div><div class=''>${profile_data.summary.length}</div></div>
			`;
		}

		function saveProfileData() {
			sap_data.local.profile_save = profile_data;
			storage.save({ local: sap_data.local });
			overlays._closeOverlay('saveuserdata');
		}
	},

	loadProfileData: () => {
		let overlay = overlays._createOverlay({ title: 'LOAD SAVED DATA', body_text: 'Are you sure you want to load saved profile data?', footer_text: 'You will need to manually save afterwards!', type: 'generic', buttons: [{ text: 'Load', class: 'good', action: 'load' }, { text: 'Cancel', class: 'bad', action: 'close' }] });

		overlay.querySelector('.load').addEventListener('click', loadUserData);

		function loadUserData() {
			const { personaname, real_name, custom_url, summary } = sap_data.local.profile_save;

			qs('[name="personaName"]').value = personaname;
			qs('[name="real_name"]').value = real_name;
			qs('[name="customURL"]').value = custom_url;
			qs('[name="summary"]').value = summary;

			overlays._closeOverlay('loadsaveddata');
		}
	},

	_createOverlay: ({ title, type, body_text, footer_text, footer_text_hidden_by_default, buttons } = {}) => {
		const overlay_id = title.replace(/\s/g, '').toLowerCase();
		let overlay_parent = document.createElement('div');
		overlay_parent.id = overlay_id;
		overlay_parent.classList.add('overlay');

		let overlay = document.createElement('div');
		overlay.classList.add('overlay-container');

		// Generate the button container
		let buttons_html = '';
		buttons.forEach((button) => buttons_html += `<button id='overlay-${overlay_id}-${button.class}' class='overlay-button-${button.class} overlay-button ${button.action ? button.action : ''}'>${button.text}</button>`);

		// Generate the body
		overlay.insertAdjacentHTML('beforeend', `<div class='padding overlay-title'>${title}</div>`);
		overlay.insertAdjacentHTML('beforeend', `<div class='padding overlay-body ${type}'>${body_text ? body_text : ''}</div>`);
		if (footer_text) overlay.insertAdjacentHTML('beforeend', `<div class='padding overlay-footer-text ${footer_text_hidden_by_default ? 'hidden' : ''}'>${footer_text}</div>`);
		overlay.insertAdjacentHTML('beforeend', `<div class='padding overlay-button-container'>${buttons_html}</div>`);

		// Inject the overlay into the page
		overlay_parent.appendChild(overlay);
		qs('html').insertBefore(overlay_parent, qs('body'));

		overlays._openOverlay(overlay_id);

		return overlay;
	},

	_openOverlay: (overlay_id) => {
		const body = qs('body');
		const overlay = qs(`#${overlay_id}`);
		const close_overlay = qs(`#${overlay_id} button.close`);

		close_overlay.focus();
		close_overlay.addEventListener(`click`, () => overlays._closeOverlay(overlay_id));
		setTimeout(() => overlay.classList.add(`not-faded`), 10);
		setTimeout(() => body.classList.add('zoned_out'), 30);
	},

	_closeOverlay: (overlay_id) => {
		const body = qs('body');
		const overlay = qs(`#${overlay_id}`);

		overlay.classList.remove(`not-faded`);
		body.classList.remove('zoned_out');

		setTimeout(() => overlay.remove(), 400);
	}
};