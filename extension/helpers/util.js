
// ─── WEBPAGE INTERACTION ────────────────────────────────────────────────────────
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

const injectStylesheetToHead = (directory) => qs(`head`).insertAdjacentHTML(`beforeend`, `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(directory)}">`);
const injectHTMLElementAsChild = (parent_element, element_to_add, position) => parent_element.insertAdjacentHTML(position || `beforeend`, element_to_add);

const copyTextInput = (element, btn_init) => { btn_init.classList.remove('btn_copy_click'); setTimeout(() => btn_init.classList.add('btn_copy_click'), 10); element.style.display = 'block'; element.focus(); element.select(); element.setSelectionRange(0, 99999); document.execCommand('copy'); element.style.display = 'none'; };

// ─── TIME ───────────────────────────────────────────────────────────────────────
const time = {
	now: () => Date.now(),
	utcToString: (utc_time) => new Date(new Date(utc_time).getTime()).toLocaleString(),
	hoursToMilliseconds: (hours) => hours * 60 * 60 * 1000,
	checkAge: (age, hours) => age + time.hoursToMilliseconds(hours) > time.now(),
	updateSchedule: (cached_time, timeout) => `\nCurrent time: ${time.utc_to_string(time.now())}\nNext Update: ${time.utc_to_string(cached_time + timeout)}`
};

// ─── HTTPS REQUESTS ─────────────────────────────────────────────────────────────
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

// ─── LOGGING ────────────────────────────────────────────────────────────────────
function log(data, type) {
	if (type === 'error') log_data = { color: `#ff3939` };
	else if (type === 'warning') log_data = { color: `#ffaa00` };
	else if (type === `notice`) log_data = { color: `#0092ff` };
	else log_data = { color: `#ffffff` };

	if (typeof data === 'string')
		return console.log(`%c[SAP] [${new Date().toLocaleString()}] ${data}`, `color: ${log_data.color}; padding:1px`);

	console.log(`%c[SAP] [${new Date().toLocaleString()}] ↓`, `color: ${log_data.color}`);
	console.log(data);
}

// ─── OTHER ──────────────────────────────────────────────────────────────────────
function compareString(current, base) {
	let percent = 0;
	let x = 0;
	while (current.length > x++) {
		if (current.charAt(x) === base.charAt(x)) percent++;
	}
	return Math.round(percent / current.length * 100);
};