const manncostore = {
	getBots: async () => {
		const manncostore_response = await webRequest(`get`, `https://mannco.store/bots`);

		const bots = [...new Set(manncostore_response.match(/765[0-9]{14}/g))];  // Remove duplicates from our request and assign to array
		return bots;
	}
}