
let p_elem = {
	profile_picture: document.querySelector(`#user-profile-picture`),
	personaname: document.querySelector(`#user-persona-name`),
	pos_votes: document.querySelector(`#backpacktf-votes-good`),
	neg_votes: document.querySelector(`#backpacktf-votes-bad`),
	ref_total: document.querySelector(`#refined-metal`),
	ref_val: document.querySelector(`#refined-value`),
	last_update: document.querySelector(`#last-update`),
	profile_link: document.querySelector(`#user-backpacktf-link`)
};

backpacktf_popup();
async function backpacktf_popup() {
	let sap_extension = await get_sap_extension();
	let { steamid, profile_picture } = url_params(window.location.href);
	let bp_response = JSON.parse(await xhr_send(`get`, `https://backpack.tf/api/IGetUsers/v3?steamid=${steamid}`)).response.players[steamid];

	// Basic user info ===================
	p_elem.profile_picture.src = profile_picture;
	p_elem.personaname.innerText = bp_response.name;

	// User "reputation" votes ===========
	p_elem.pos_votes.innerText = bp_response.backpack_tf_trust.for;
	p_elem.neg_votes.innerText = bp_response.backpack_tf_trust.against;
	if (bp_response.backpack_tf_trust.for > 0) {
		p_elem.pos_votes.parentElement.style.backgroundColor = `#1c5d0c`;
	}
	if (bp_response.backpack_tf_trust.against > 0) {
		p_elem.neg_votes.parentElement.style.backgroundColor = `#711111`;
	}

	// TF2 Inventory ======================
	p_elem.ref_total.innerText = `No Data`;
	p_elem.ref_val.innerText = `No Data`;
	if (bp_response.backpack_value) {
		if (bp_response.backpack_value[440]) {
			p_elem.ref_total.innerText = bp_response.backpack_value[440].toFixed(2);
			p_elem.ref_val.innerText = `$${(sap_extension.data.backpacktf.refined.usd * bp_response.backpack_value[440]).toFixed(2)}` || `No Data`;
			p_elem.ref_val.title = sap_extension.data.backpacktf.refined.usd ? `Refined @ $${sap_extension.data.backpacktf.refined.usd}/Ref` : `No Refined Metal price data set!`;
		}
	}

	// Check ==============================
	p_elem.last_update.innerText = bp_response.backpack_update ? time.utc_to_string(bp_response.backpack_update[440] * 1000).split(`,`)[0] : `No Data`;
	p_elem.profile_link.innerText = `Click Here!`;
	p_elem.profile_link.href = `https://backpack.tf/profiles/${steamid}`;
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
			resolve(response.sap_extension);
		});
	});
}
