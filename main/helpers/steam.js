const steam = {
	// Generates a class name from a given number so that Steam's stylesheet can show it properly
	level_class: (level) => {
		let e = (function (n) {
			if ((n.toString(), n)) {
				let e = { thousand: '0', hundred: '0', ten: '0', one: '0' };
				return 4 == n.length ? ((e.thousand = n[0]), (e.hundred = n[1]), (e.ten = n[2])) : 3 == n.length ? ((e.hundred = n[0]), (e.ten = n[1])) : 2 == n.length ? (e.ten = n[0]) : (e.one = n[0]), e;
			}
		})('' + level);
		return '0' != e.thousand ? 'lvl_' + e.thousand + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.hundred ? 'lvl_' + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.ten ? 'lvl_' + e.ten + '0' : 'lvl_' + level;
	},
	account_age: (date_string) => {
		const months = {
			'January': 0,
			'February': 1,
			'March': 2,
			'April': 3,
			'May': 4,
			'June': 5,
			'July': 6,
			'August': 7,
			'September': 8,
			'October': 9,
			'November': 10,
			'December': 11,
		};

		const day = date_string.split(` `)[1].replace(`,`, ``);
		const month = date_string.split(` `)[0];
		const year = date_string.split(` `)[2];

		const account_creation_timestamp = new Date(year, months[month], day);
		const time_now = new Date(Date.now());

		const years_apart = time_now.getFullYear() - account_creation_timestamp.getFullYear();
		const months_apart = time_now.getFullYear() - account_creation_timestamp.getFullYear();
		const days_apart = time_now.getDay() - account_creation_timestamp.getDay();

		if (years_apart > 0) return `${years_apart} years`;
		if (months_apart > 0) return `${months_apart} months`;
		if (days_apart > 0) return `${days_apart} days`;
	}
}