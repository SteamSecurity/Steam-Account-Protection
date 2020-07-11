const api = {
	reputation: {
		steamrep: (steamid) => {
			return new Promise(async (resolve, reject) => {
				let profile_data = {
					steamid: steamid,
					good_tags: [],
					bad_tags: [],
					pending_reports: 0,
					pending_reports_link: null,
					last_check: 0
				};
				let profile_reputation;

				/* -------------------- Check for existing SteamRep data -------------------- */
				profile_reputation = storage.find_steamrep(steamid.toString());
				if (profile_reputation && time.check_age(profile_reputation.last_check, 1))
					return resolve(profile_reputation);

				/* ------------------------ Create new SteamRep data ------------------------ */
				// Master
				console.log(`Requesting new data`);
				webrequest(`get`, `https://steamrep.com/api/beta4/reputation/${steamid}?extended=1&json=1&tagdetails=1`)
					.then(format)
					.then(save)
					.then((res) => resolve(res));
				//.catch(reject);

				function format(raw_response) {
					return new Promise((resolve, reject) => {
						let response = {};
						try { JSON.parse(raw_response); }
						catch { reject(`Could not convert ${raw_response} to json`); }
						const steamrep = JSON.parse(raw_response).steamrep;

						response.last_check = time.current_time();
						response.pending_reports = steamrep.stats.unconfirmedreports.reportcount;
						response.pending_reports_link = steamrep.stats.unconfirmedreports.reportlink;
						response.bad_tags = [];
						response.good_tags = [];

						if (!steamrep.reputation.tags) return resolve(response);

						// Tags
						// Steamrep doesn't use an array for people with a single tag
						if (!steamrep.reputation.tags.tag[0]) {
							if (steamrep.reputation.tags.tag.category == 'trusted') response.good_tags.push(steamrep.reputation.tags.tag.name);
							if (steamrep.reputation.tags.tag.category == 'evil') response.bad_tags.push(steamrep.reputation.tags.tag.name);
						}
						// If we do have an array, we have more than one tag to categorize
						if (steamrep.reputation.tags.tag[0]) {
							steamrep.reputation.tags.tag.forEach((tag) => {
								if (tag.category === 'trusted') response.good_tags.push(tag.name);
								if (tag.category === 'evil') response.bad_tags.push(tag.name);
							});
						}
						return resolve(response);
					});
				}

				function save(steamrep_data) {
					return new Promise((resolve, reject) => {
						sap_extension.data.user_profiles.steamrep_profiles.push(steamrep_data);
						storage.save_settings();
						resolve(steamrep_data);
					});
				}

				/* 
								// Functions 
								function format(web_response) {
									return new Promise((resolve, reject) => {
										try { JSON.parse(web_response); }
										catch { reject(`Could not convert ${web_response} to json`); }
										const response = JSON.parse(web_response).steamrep;
				
										profile_data.last_check = time.current_time();
										profile_data.pending_reports = response.stats.unconfirmedreports.reportcount;
										profile_data.pending_reports_link = response.stats.unconfirmedreports.reportlink;
				
										if (response.reputation.tags) {
											tags(response)
												.then((tag_object) => {
													profile_data.good_tags = tag_object.good_tags;
													profile_data.bad_tags = tag_object.bad_tags;
												})
												.then(resolve(profile_data));
										} else {
											resolve(profile_data);
										}
				
									});
				
								}
				
								function tags(response) {
									return new Promise((resolve, reject) => {
										let tag_response = { bad_tags: [], good_tags: [] };
				
										// Steamrep doesn't use an array for people with a single tag
										if (!response.reputation.tags.tag[0]) {
											if (response.reputation.tags.tag.category == 'trusted') tag_response.good_tags.push(response.reputation.tags.tag.name);
											if (response.reputation.tags.tag.category == 'evil') tag_response.bad_tags.push(response.reputation.tags.tag.name);
										}
										// If we do have an array, we have more than one tag to categorize
										if (response.reputation.tags.tag[0]) {
											response.reputation.tags.tag.forEach((tag) => {
												if (tag.category === 'trusted') tag_response.good_tags.push(tag.name);
												if (tag.category === 'evil') tag_response.bad_tags.push(tag.name);
											});
										}
										resolve(tag_response);
									});
				
								}
				
								function save() {
									return new Promise((resolve, reject) => {
										sap_extension.data.user_profiles.steamrep_profiles.push(profile_data);
										storage.save_settings();
										resolve()
									});
				
								} */
			});
		}
	},
	update: {
		bots: () => {
			if (sap_extension.data.bot_profiles.last_check + time.hours_to_seconds(24) > time.current_time()) return log(`Bot list: Not updated`);
			const pattern = { steamid: /7[0-9]{16}/g, xml_next_page: /<nextPageLink>[!-z]+<\/nextPageLink>/g, xml_total_pages: /<totalPages>[0-9]+<\/totalPages>/g, number: /[0-9]+/ };

			marketplace();  // Get Marketplace.tf bots
			mannco();  // Get Mannco.Store bots
			bitskins();  // Get Bitskins bots
			return;

			async function marketplace() {
				const response = JSON.parse(await webrequest(`get`, `https://marketplace.tf/api/Bots/GetBots/v2`));
				if (!response) return;
				if (!response.success) return;

				let bots = []; // Array of SteamID64s

				response.bots.forEach((bot) => bots.push(bot.steamid)); // Push only the SteamIDs of the bots
				sap_extension.data.bot_profiles.marketplace = bots; // Update internal settings

				log(`Got ${response.bots.length} Marketplace.tf bots`); // Log to console
				sap_extension.data.bot_profiles.last_check = time.current_time();
				storage.save_settings();
			}
			async function mannco() {
				const response = await webrequest(`get`, `https://mannco.store/bots`);
				if (!response) return;

				const bots = [...new Set(response.match(pattern.steamid))];  // Remove duplicates from our request
				sap_extension.data.bot_profiles.mannco = bots;

				log(`Got ${bots.length} Mannco.Store bots`);
				sap_extension.data.bot_profiles.last_check = time.current_time();
				storage.save_settings();
			}
			async function bitskins() {
				let bots = [];
				let page = 1;

				while (true) {
					let page_data = await webrequest(`get`, `https://steamcommunity.com/groups/bitskinsbots/memberslistxml/?xml=1&p=${page}`);
					bots = [...bots, ...page_data.match(pattern.steamid)];
					if (page_data.match(pattern.xml_next_page) && page++ <= 15) continue;
					else break;
				}
				sap_extension.data.bot_profiles.bitskins = bots;

				log(`Got ${bots.length} Bitskins bots`);
				sap_extension.data.bot_profiles.last_check = time.current_time();
				storage.save_settings();
			}
		},
		user_profiles: async () => {
			if (sap_extension.data.user_profiles.last_check + time.hours_to_seconds(24) >= time.current_time()) return log(`Impersonated list: Not Updated`);

			let users = [];
			let response = JSON.parse(await webrequest(`get`, `https://backpack.tf/api/IGetUsers/GetImpersonatedUsers`));

			response = response.results.filter(not_marketplace);  // Makes sure the user is not a Marketplace.tf bot
			response.forEach((user) => users.push(format_user(user)));  // Returns the user in an object that is properly formatted 

			log(`Got ${users.length} Backpack.tf Impersonated users`);
			sap_extension.data.user_profiles.impersonated = users;
			sap_extension.data.user_profiles.last_check = time.current_time();
			storage.save_settings();

			function not_marketplace(user) {
				return !/Marketplace.TF \| Bot ([0-9]+)/i.test(user.personaname);
			}
			function format_user(user) {
				return {
					steamid: user.steamid,
					profile_picture: user.avatar.replace(`_medium.jpeg`, `_full.jpeg`),
					personaname: user.personaname,
					url: `http://steamcommunity.com/profiles/${user.steamid}`
				};
			}
		}
	},
	filter: {
		profiles: () => {
			if (loc.origin.includes(`chrome-extension://`)) return;

			sap_extension.data.user_profiles.steamrep_profiles.forEach((profile, index) => {
				if (time.current_time() >= profile.last_check + time.hours_to_seconds(1)) sap_extension.data.user_profiles.steamrep_profiles.splice(index, 1);
			});
			sap_extension.data.user_profiles.reptf_profiles.forEach((profile, index) => {
				if (time.current_time() >= profile.last_check + time.hours_to_seconds(1)) sap_extension.data.user_profiles.reptf_profiles.splice(index, 1);
			});
			storage.save_settings();
		}
	}
};
