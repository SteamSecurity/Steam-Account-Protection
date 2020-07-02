/* ----------------------------- Basic Selectors ---------------------------- */
const qs = (tag) => document.querySelector(tag);
const qsa = (tag) => document.querySelectorAll(tag);

/* ---------------------------------- Time ---------------------------------- */
const time = {
	current_time: () => Math.floor(Date.now() / 1000),																			//Returns the current time in seconds
	//TODO: Need example to show here in comments
	utc_to_string: (utc_time) => new Date(new Date(utc_time).getTime()).toLocaleString(),		// Converts utc time into a readable string.
	hours_to_seconds: (hours) => hours * 60 * 60,
	check_age: (age, hours) => age + time.hours_to_seconds(hours) > time.current_time() 		// If the "age" + "hours" is greater than the current time (Age is young), return true
};

/* ---------------------------- URL and Requests ---------------------------- */
function url_params(url) {
	let vars = {};
	url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => vars[key] = value);
	return vars;
}
function webrequest(type, url) {
	return new Promise((resolve, reject) => {
		var newXHR = new XMLHttpRequest() || new window.ActiveXObject('Microsoft.XMLHTTP');
		newXHR.open(type, url, true);
		newXHR.send();
		newXHR.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) return resolve(this.response);
				else return reject({ error: this.status });
			}
		};
	});
}

/* ------------------------------- Comparison ------------------------------- */
const compare = {
	//Compares two strings and returns a decimal between 0 and 1 based on how similar they are
	string: (current, base) => {
		let percent = 0;
		let x = 0;
		while (current.length > x++) if (current.charAt(x) === base.charAt(x)) percent++;
		return Math.round(percent / current.length * 100);
	}
};

/* ---------------------------------- Misc ---------------------------------- */
//Custom console.log formatting
function log(data, type) {
	if (typeof data === 'string') return console.log(`%c[SAP] [${new Date().toLocaleString()}] ${data}`, 'color: #ffffff');
	console.log(`%c[SAP] [${new Date().toLocaleString()}] ↓`, 'color: #ffffff');
	console.log(data);
}

// Saves the internal settings
async function save_settings(set_default) {
	if (!set_default) return chrome.storage.local.set({ sap_extension: sap_extension });  // Save the current settings
	// Save the default settings
	sap_extension = {
		settings: {
			trade_window: {
				api_warning: true,
				trade_toolbar: true,
				tw_reputation_scanner: true,
				tw_impersonator_scanner: true
			},
			trade_offers: {},
			profile: {
				buddy_button: true,
				pr_reputation_scanner: true,
				pr_impersonator_scanner: true
			}
		},
		data: {
			backpacktf: {
				refined: {
					usd: null
				}
			},
			bot_profiles: {
				marketplace: [],
				mannco: [],
				bitskins: [],
				last_check: 0
			},
			user_profiles: {
				impersonated: [],
				buddies: [],
				steamrep_profiles: [],
				reptf_profiles: [],
				last_check: 0
			}
		}
	};
	chrome.storage.local.set({ sap_extension: sap_extension });
	log(`Saved default settings`);
	return;
}

const find_user = {
	buddy: (steamid) => {
		let data = { response: {}, index: -1, is_buddy: () => data.index !== -1 };
		sap_extension.data.user_profiles.buddies.find((buddy, index) => {
			if (buddy.steamid === steamid) {
				data.response = buddy;
				data.index = index;
			}
		});
		return data;
	}
};