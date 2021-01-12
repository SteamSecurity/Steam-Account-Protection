const steam = {
	// Returns an object that contains how old an account is in years, months, and days.
	// The point of this is to be more accurate that what steam generally tells the user. (Years only)
	getAccountAge: (age_years, age_months, age_days) => {
		let today = new Date();
		let account_creation_date = new Date(age_years, age_months, age_days);
		let date_now = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
		let age = new Date(date_now.getTime() - account_creation_date.getTime());
		return {
			years: age.getUTCFullYear() - 1970,
			months: age.getUTCMonth(),
			days: age.getUTCDate() - 1
		};
	},

	// Steam has nifty effects for steam levels. This is to generate a classname to allow us to harness that power.
	getLevelClassName: () => {
		let e = (function (n) {
			if ((n.toString(), n)) {
				let e = { thousand: '0', hundred: '0', ten: '0', one: '0' };
				return 4 == n.length ? ((e.thousand = n[0]), (e.hundred = n[1]), (e.ten = n[2])) : 3 == n.length ? ((e.hundred = n[0]), (e.ten = n[1])) : 2 == n.length ? (e.ten = n[0]) : (e.one = n[0]), e;
			}
		})('' + level);
		return '0' != e.thousand ? 'lvl_' + e.thousand + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.hundred ? 'lvl_' + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.ten ? 'lvl_' + e.ten + '0' : 'lvl_' + level;
	},


	enums: {
		vac_banned: {
			'0': false,
			'1': true
		},
		trade_banned: {
			'0': false,
			'1': true,
		}
	}
}