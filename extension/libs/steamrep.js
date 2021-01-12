const steamrep = {
	getReputation: async (steamid, { force_update = false } = {}) => {
		let profile_reputation = {
			last_updated: '',
			reputation: {},
			banned_friends: '',
			unconfirmed_reports: {},
			steam_bans: {}
		};

		// If we are not forcing an update, check if we have their steamrep data saved and it is valid.
		if (!force_update) profile_reputation = sap_storage.find.steamrep(steamid);
		if (profile_reputation) return profile_reputation;

		// No valid saved SteamRep data found! Request it and save it!
		log(`Creating SteamRep profile for ${steamid}.`);
		const steamrep_response = await webRequest('get', `https://steamrep.com/api/beta4/reputation/${steamid}?extended=1&json=1&tagdetails=1`);

		log(steamrep_response);

		profile_reputation.last_updated = time.now();
		profile_reputation.reputation = steamrep_response.reputation;
		profile_reputation.banned_friends = steamrep_response.stats.bannedfriends;
		profile_reputation.unconfirmed_reports = steamrep_response.stats.unconfirmedreports;
		profile_reputation.steam_bans = { vac: steamrep_response.vacban, trade: steamrep_response.tradeban };

		return profile_reputation;
	}
}