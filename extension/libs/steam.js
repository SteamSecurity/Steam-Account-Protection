const steam = {
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