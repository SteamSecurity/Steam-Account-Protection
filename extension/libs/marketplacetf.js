const marketplacetf = {
	getBots: async () => {
		const marketplacetf_response = JSON.parse(await webRequest(`get`, `https://marketplace.tf/api/Bots/GetBots/v2`));

		let bot_list = [];	// This should be a list of SteamID64 bots.
		marketplacetf_response.bots.forEach((bot) => bot_list.push(bot.steamid));	// We do not need anything other than their SteamID64
		return bot_list;
	}
}