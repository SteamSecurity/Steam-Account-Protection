// TODO: Ensure SteamRep returns accurate trade status. Trade banned or not?

const steamrep = {
	getReputation: async (steamid, { force_update = false } = {}) => {
		const addGoodTag = (tag) => profile_reputation.good_tags.push(tag);
		const addBadTag = (tag) => { profile_reputation.bad_tags.push(tag); profile_reputation.is_banned = true; };

		let profile_reputation = {
			is_banned: false,
			request_time: '',
			good_tags: [],
			bad_tags: [],
			unconfirmed_reports: null,
			summary: '',
			account_creation_date: '',
			steam_bans: {}
		};

		// If we are not forcing an update, check if we have their steamrep data saved and it is valid.
		if (!force_update) cached_profile_reputation = storage.getProfileReputation(steamid);
		if (cached_profile_reputation) return cached_profile_reputation;

		// No valid saved SteamRep data found! Request it and save it!
		log.standard(`Creating SteamRep profile for ${steamid}.`, 'notice');

		const steamrep_response = JSON.parse(await webRequest('get', `https://steamrep.com/api/beta4/reputation/${steamid}?extended=1&json=1&tagdetails=1`)).steamrep;
		const steamrep_tags = steamrep_response.reputation.tags.tag;

		profile_reputation.request_time = time.now();
		profile_reputation.unconfirmed_reports = steamrep_response.stats.unconfirmedreports;
		profile_reputation.steam_bans = { vac: steam.steamrep_enum.vac_banned[steamrep_response.vacban], trade: steam.steamrep_enum.trade_banned[steamrep_response.tradeban] };
		profile_reputation.account_creation_date = steamrep_response.membersince;

		log.debug('Returned data from request:');
		log.debug(steamrep_response);

		if (profile_reputation.steam_bans.vac.class === 'banned' || profile_reputation.steam_bans.trade.class === 'banned')
			profile_reputation.is_banned = true;

		if (steamrep_tags) {
			if (Array.isArray(steamrep_tags)) {
				steamrep_tags.forEach((tag) => {
					if (tag.category === 'trusted') addGoodTag(tag.name);
					if (tag.category === 'evil') addBadTag(tag.name);
				});
			}
			else {
				if (steamrep_tags.category == 'trusted') addGoodTag(steamrep_tags.name);
				if (steamrep_tags.category == 'evil') addBadTag(steamrep_tags.name);
			}
		}

		if (profile_reputation.bad_tags.length > 0) profile_reputation.summary = steam.steamrep_enum.rep_banned['banned'];
		else if (profile_reputation.good_tags.length > 0) profile_reputation.summary = steam.steamrep_enum.rep_banned['trusted'];
		else profile_reputation.summary = steam.steamrep_enum.rep_banned['normal'];

		if (profile_reputation.is_banned) {
			sap_data.sync.statistics.reputation_detected++;
			storage.save({ sync: sap_data.sync });
		}

		log.debug('Saved profile reputation object:');
		log.debug(profile_reputation);

		storage.saveProfileReputation(steamid, profile_reputation);

		return profile_reputation;
	}
};