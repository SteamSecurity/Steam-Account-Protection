const compare = {
	//Compare two images using thirdparty Resemble.js
	image: (current, base) => {
		return new Promise((resolve) => {
			resemble(current).compareTo(base).ignoreAlpha().ignoreColors().ignoreAntialiasing().onComplete(function(data) {
				resolve(100 - data.rawMisMatchPercentage);
			});
		});
	},
	//Compares two strings and returns a decimal between 0 and 1 based on how similar they are
	string: (current, base) => {
		let percent = 0;
		for (x = 0; current.length > x; x++) {
			if (current.charAt(x) == base.charAt(x)) {
				percent++;
			}
		}
		return Math.round(percent / current.length * 100);
	}
};

//Sends XHR request
function xhr_send(type, url) {
	return new Promise((resolve) => {
		var newXHR = new XMLHttpRequest() || new window.ActiveXObject('Microsoft.XMLHTTP');
		newXHR.open(type, url.replace('http://', 'https://'), true);
		newXHR.send();
		newXHR.onreadystatechange = function() {
			if (this.status === 200 && this.readyState === 4) {
				resolve(this.response);
			} else if (this.readyState === 4) {
				resolve(null);
			}
		};
	});
}

//Generate class name for steam levels
function steam_level_class(n) {
	var e = (function(n) {
		if ((n.toString(), n)) {
			var e = {
				Thousand: '0',
				Hundred: '0',
				Ten: '0',
				One: '0'
			};
			return 4 == n.length ? ((e.Thousand = n[0]), (e.Hundred = n[1]), (e.Ten = n[2])) : 3 == n.length ? ((e.Hundred = n[0]), (e.Ten = n[1])) : 2 == n.length ? (e.Ten = n[0]) : (e.One = n[0]), e;
		}
	})('' + n);
	return '0' != e.Thousand ? 'lvl_' + e.Thousand + e.Hundred + '00 lvl_plus_' + e.Ten + '0' : '0' != e.Hundred ? 'lvl_' + e.Hundred + '00 lvl_plus_' + e.Ten + '0' : '0' != e.Ten ? 'lvl_' + e.Ten + '0' : 'lvl_' + n;
}

//Converts UTC to plain time
function utc_to_time(utc_time) {
	return new Date(new Date(utc_time).getTime()).toLocaleString();
}

//Returns the current time in seconds
function current_time() {
	return Math.floor(Date.now() / 1000);
}

//Custom console.log format
function log(data, type) {
	if (typeof data === 'string') {
		console.log('%c[SAP] [' + new Date().toLocaleString() + '] ' + data, 'color: #ffffff');
		return;
	}
	console.log('%c[SAP] [' + new Date().toLocaleString() + '] ' + '↓', 'color: #ffffff');
	console.log(data);
}

// Saves the internal settings
async function save_settings(set_default) {
	if (!set_default) {
		log(`Saving settings`);
		chrome.storage.local.set({ sap_extension: sap_extension });
		return;
	}
	log(`Saving default settings`);
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
	return;
}
