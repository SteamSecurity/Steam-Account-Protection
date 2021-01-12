
// ─── WEBPAGE INTERACTION ────────────────────────────────────────────────────────
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

const injectStylesheetToHead = (directory) => qs(`head`).insertAdjacentHTML(`beforeend`, `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(directory)}">`);
const injectHTMLElementAsChild = (parent_element, element_to_add) => parent_element.insertAdjacentHTML(`beforeend`, element_to_add);

// ────────────────────────────────────────────────────── WEBPAGE INTERACTION ─────
const time = {
	now: Date.now(),
	utcToString: (utc_time) => new Date(new Date(utc_time).getTime()).toLocaleString(),
	hoursToMilliseconds: (hours) => hours * 60 * 60 * 1000,
	checkAge: (age, hours) => age + time.hoursToMilliseconds(hours) > time.now(),
	updateSchedule: (cached_time, timeout) => `\nCurrent time: ${time.utc_to_string(time.current_time())}\nNext Update: ${time.utc_to_string(cached_time + timeout)}`
};

function webRequest(type, url) {
	return new Promise((resolve, reject) => {
		let newXHR = new XMLHttpRequest() || new window.ActiveXObject('Microsoft.XMLHTTP');
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

function log(data) {
	if (typeof data === 'string')
		return console.log(`%c[SAP] [${new Date().toLocaleString()}] ${data}`, 'color: #ffffff');

	console.log(`%c[SAP] [${new Date().toLocaleString()}] ↓`, 'color: #ffffff');
	console.log(data);
}

function settingIsEnabled(setting) {
	console.log(`Checking ${setting} => ${sap_data.sync.settings[setting]}`);
	return sap_data.sync.settings[setting];
}