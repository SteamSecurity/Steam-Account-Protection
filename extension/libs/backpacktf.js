const backpacktf = {
	getImpersonatedProfiles: async () => {
		let users = [];
		const isNotMarketplacetf = (profile) => !/Marketplace.TF \| Bot ([0-9]+)/i.test(profile.personaname) && !/MPTF Bot ([0-9]+)/i.test(profile.personaname);

		const response = JSON.parse(await webRequest(`get`, `https://backpack.tf/api/IGetUsers/GetImpersonatedUsers`)).results;

		// Some goober who has probably been fired by now included 1/3 of the Marketplace.tf bots.
		// The inclusion was made by mistake, I'm sure.
		users = response.filter(isNotMarketplacetf);
		return users;
	}
}