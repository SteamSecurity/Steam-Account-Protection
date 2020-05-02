let url_parts = url_params(window.location.href),
	page_elements = {
		profile_picture: document.querySelector(`#user-profile-picture`),
		personaname: document.querySelector(`#user-persona-name`),
		positive_votes: document.querySelector(`#backpacktf-votes-good`),
		negative_votes: document.querySelector(`#backpacktf-votes-bad`),
		refined_metal: document.querySelector(`#refined-metal`),
		refined_value: document.querySelector(`#refined-value`),
		last_update: document.querySelector(`#last-update`),
		profile_link: document.querySelector(`#user-backpacktf-link`)
	},
	sap_extension;

backpacktf();

async function backpacktf() {
	await get_sap_extension();
	let response = JSON.parse(await xhr_send(`get`, `https://backpack.tf/api/IGetUsers/v3?steamid=${url_parts.steamid}`)).response.players[url_parts.steamid];

	// Basic user info ===================
	page_elements.profile_picture.src = url_parts.profile_picture;
	page_elements.personaname.innerText = response.name;

	// User "reputation" votes ===========
	page_elements.positive_votes.innerText = response.backpack_tf_trust.for;
	page_elements.negative_votes.innerText = response.backpack_tf_trust.against;
	// Color ===
	if (response.backpack_tf_trust.for > 0) {
		page_elements.positive_votes.parentElement.style.backgroundColor = `#1c5d0c`;
	}
	if (response.backpack_tf_trust.against > 0) {
		page_elements.negative_votes.parentElement.style.backgroundColor = `#711111`;
	}

	// TF2 Inventory ======================
	page_elements.refined_metal.innerText = `No Data`;
	page_elements.refined_value.innerText = `No Data`;

	if (response.backpack_value) {
		if (response.backpack_value[440]) {
			page_elements.refined_metal.innerText = response.backpack_value[440].toFixed(2);
			page_elements.refined_value.innerText = `$${(sap_extension.data.backpacktf.refined.usd * response.backpack_value[440]).toFixed(2)}` || `No Data`;
			page_elements.refined_value.title = sap_extension.data.backpacktf.refined.usd ? `Refined @ $${sap_extension.data.backpacktf.refined.usd}/Ref` : `No Refined Metal price data set!`;
		}
	}

	// Check ==============================
	page_elements.last_update.innerText = response.backpack_update ? utc_to_time(response.backpack_update[440] * 1000).split(`,`)[0] : `No Data`;
	page_elements.profile_link.innerText = `Click Here!`;
	page_elements.profile_link.href = `https://backpack.tf/profiles/${url_parts.steamid}`;
}

// Functions =====================================================
//Sends XHR request ==================
function xhr_send(type, url, data) {
	return new Promise((resolve) => {
		var newXHR = new XMLHttpRequest() || new window.ActiveXObject('Microsoft.XMLHTTP');
		newXHR.open(type, url.replace('http://', 'https://'), true);
		newXHR.send(data);
		newXHR.onreadystatechange = function () {
			if (this.status === 200 && this.readyState === 4) {
				resolve(this.response);
			} else if (this.readyState === 4) {
				resolve(``);
			}
		};
	});
}
// Gets SAP settings =================
function get_sap_extension() {
	return new Promise((resolve) => {
		chrome.storage.local.get(['sap_extension'], (response) => {
			sap_extension = response.sap_extension;
			resolve(1);
		});
	});
}
// Get URL params =====================
function url_params(url) {
	var vars = {};
	var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
}
//Converts UTC to plain time ==========
function utc_to_time(utc_time) {
	return new Date(new Date(utc_time).getTime()).toLocaleString();
}
