const _logging_debug = true;	// Enable additional debugging options. (For developers)


// ─── WEBPAGE INTERACTION ────────────────────────────────────────────────────────
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

const injectStylesheetToHead = (directory) => qs(`head`).insertAdjacentHTML(`beforeend`, `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(directory)}">`);
const injectHTMLElementAsChild = (parent_element, element_to_add, position) => parent_element.insertAdjacentHTML(position || `beforeend`, element_to_add);

const copyTextInput = (element, btn_init) => { btn_init.classList.remove('btn_copy_click'); setTimeout(() => btn_init.classList.add('btn_copy_click'), 10); element.style.display = 'block'; element.focus(); element.select(); element.setSelectionRange(0, 99999); document.execCommand('copy'); element.style.display = 'none'; };


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
const log = {
	standard: (data, type) => {
		if (type === 'error') log_data = { color: `#ff3939` };
		else if (type === 'warning') log_data = { color: `#ffaa00` };
		else if (type === 'debug') log_data = { color: `#bf00ff` };
		else if (type === 'notice') log_data = { color: `#0092ff` };
		else log_data = { color: `#ffffff` };

		if (type === 'debug') type = type.toUpperCase();

		if (typeof data === 'string')
			return console.log(`%c[SAP] ${type ? "[" + type + "] " : ''}%c[${new Date().toLocaleString()}] ${data}`, `color: ${log_data.color}; padding:1px`, ``);

		console.log(`%c[SAP] ${type ? "[" + type + "] " : ''}%c[${new Date().toLocaleString()}] ↓`, `color: ${log_data.color};`, ``);
		console.log(data);
	},
	debug: (data) => {
		if (_logging_debug) log.standard(data, 'debug');
	}
};

// ─── OTHER ──────────────────────────────────────────────────────────────────────
const addClassToElement = (target, class_to_add) => qs(target).classList.add(class_to_add);

function compareString(current, base) {
	let percent = 0;
	let x = 0;
	while (current.length > x++) {
		if (current.charAt(x) === base.charAt(x)) percent++;
	}
	return Math.round(percent / current.length * 100);
};

function steamProfilePictureFullLink(link) {
	if (link.includes('_full.jpg')) return link;
	if (!link.includes('_')) return link.replace('.jpg', '_full.jpg');
	return link.replace('_medium.jpg', '_full.jpg');
};