const steam = {
	// Returns an object that contains how old an account is in years, and months.
	getAccountAge: (age_years, age_months) => {
		const age_dif = Date.now() - (new Date(age_years, age_months)).valueOf();
		const age_date = new Date(age_dif);

		return {
			years: Math.abs(age_date.getUTCFullYear() - 1970),
			months: Math.abs(age_date.getMonth())
		};
	},

	getAccountAgeString: (creation_date) => {
		const account_age = new Date(creation_date * 1000);
		const age_obj = steam.getAccountAge(account_age.getFullYear(), account_age.getMonth());
		return `${age_obj.years ? age_obj.years + ' years ' : ''}${age_obj.months ? age_obj.months + ' months ' : ''}${age_obj.days ? age_obj.days + ' days' : ''}`;
	},

	// Returns an object detailing account bans. This requires an API key.
	getAccountBans: async (steamid) => {
		if (!sap_data.local.steam_api_key)
			return { error: 'No Steam Web API Key' };
		else
			return await webRequest('get', `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${sap_data.local.steam_api_key}&steamids=${steamid}`);
	},

	// Steam has nifty effects for steam levels. This is to generate a classname to allow us to harness that power.
	getLevelClassName: (level) => {
		let e = (function (n) {
			if ((n.toString(), n)) {
				let e = { thousand: '0', hundred: '0', ten: '0', one: '0' };
				return 4 == n.length ? ((e.thousand = n[0]), (e.hundred = n[1]), (e.ten = n[2])) : 3 == n.length ? ((e.hundred = n[0]), (e.ten = n[1])) : 2 == n.length ? (e.ten = n[0]) : (e.one = n[0]), e;
			}
		})('' + level);
		return '0' != e.thousand ? 'lvl_' + e.thousand + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.hundred ? 'lvl_' + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.ten ? 'lvl_' + e.ten + '0' : 'lvl_' + level;
	},

	steamrep_enum: {
		vac_banned: {
			'0': { summary: 'Normal', class: '' },
			'1': { summary: 'Banned', class: 'banned' }
		},
		trade_banned: {
			'0': { summary: '', class: '' },
			'1': { summary: 'Normal', class: '' },
			'2': { summary: 'Trade Ban', class: 'banned' },
		},
		rep_banned: {
			'normal': { summary: 'Normal', class: '' },
			'banned': { summary: 'Banned', class: 'banned' },
			'trusted': { summary: 'Trusted', class: 'trusted' }
		}
	}
}