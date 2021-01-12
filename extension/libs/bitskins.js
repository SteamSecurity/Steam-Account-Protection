const bitskins = {
	getBots: async () => {
		let bots = [];
		let page = 1;

		const pattern = { steamid: /7[0-9]{16}/g, xml_next_page: /<nextPageLink>[!-z]+<\/nextPageLink>/g };

		while (true) {
			let page_data = await webRequest(`get`, `https://steamcommunity.com/groups/bitskinsbots/memberslistxml/?xml=1&p=${page}`);

			bots = [...bots, ...page_data.match(pattern.steamid)];
			if (page_data.match(pattern.xml_next_page) && page++ <= 15) continue;
			else break;
		}
		return bots;
	}
};