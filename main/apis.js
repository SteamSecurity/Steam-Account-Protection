const api = {
	reputation: {
		reptf: (steamid) => {
			return new Promise(async (resolve, reject) => {
				let ban_data = {
					steamid: steamid,
					last_check: time.current_time(),
					bans: {}
				};
				let profile_reputation;

				// Checks if we already have their RepTF data
				sap_extension.data.user_profiles.reptf_profiles.find((reptf_data) => {
					if (reptf_data.steamid === steamid) profile_reputation = reptf_data;
				});

				if (profile_reputation && time.current_time() <= profile_reputation.last_check + time.hours_to_seconds(1)) return resolve(profile_reputation);

				// Sends request to reptf
				const raw_response = JSON.parse(await webrequest(`post`, `https://rep.tf/api/bans?str=${steamid.toString()}`));
				if (!raw_response) return reject(`No/bad response.`);

				// Filters the Object Keys in the response to only include communities
				const communities = Object.keys(raw_response).filter(is_community);

				// Saves data to a more simple object
				communities.forEach((community_name) => {
					ban_data.bans[community_name] = {};
					if (raw_response[community_name].banned === `good` || raw_response[community_name].banned === false) ban_data.bans[community_name].banned = false;
					if (raw_response[community_name].banned === `bad` || raw_response[community_name].banned === true) ban_data.bans[community_name].banned = true;

					if (raw_response[community_name].banned === `warn`) {
						ban_data.bans[community_name].banned = true;
						ban_data.bans[community_name].message = raw_response[community_name].message;
					}
				});

				sap_extension.data.user_profiles.reptf_profiles.push(ban_data);
				save_settings();
				resolve(ban_data);

				function is_community(string) {
					return string.includes(`Bans`);
				}
			});
		},
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

				// Checks if we already have their SteamRep data
				sap_extension.data.user_profiles.steamrep_profiles.find((steamrep_data) => {
					if (steamrep_data.steamid === steamid) profile_reputation = steamrep_data;
				});

				if (profile_reputation && time.current_time() <= profile_reputation.last_check + time.hours_to_seconds(1)) return resolve(profile_reputation);

				const raw_response = JSON.parse(await webrequest(`get`, `https://steamrep.com/api/beta4/reputation/${steamid}?extended=1&json=1&tagdetails=1`)).steamrep;
				if (!raw_response) return reject(`No/bad response.`);

				// Sets the check time. This will help prevent spamming requests
				profile_data.last_check = time.current_time();

				// Sets Pending Reports
				profile_data.pending_reports = raw_response.stats.unconfirmedreports.reportcount;
				profile_data.pending_reports_link = raw_response.stats.unconfirmedreports.reportlink;

				if (raw_response.reputation.tags) tags();

				// Saves the data so we won't have to talk to steamrep until SAP registers the data as out of date
				sap_extension.data.user_profiles.steamrep_profiles.push(profile_data);
				save_settings();

				// Return the data
				resolve(profile_data);

				function tags() {
					// Steamrep doesn't use an array for people with a single tag
					if (!raw_response.reputation.tags.tag[0]) {
						if (raw_response.reputation.tags.tag.category == 'trusted') profile_data.good_tags.push(raw_response.reputation.tags.tag.name);
						if (raw_response.reputation.tags.tag.category == 'evil') profile_data.bad_tags.push(raw_response.reputation.tags.tag.name);
					}
					// If we do have an array, we have more than one tag to categorize
					if (raw_response.reputation.tags.tag[0]) {
						raw_response.reputation.tags.tag.forEach((tag) => {
							//console.log(tag)
							if (tag.category === 'trusted') profile_data.good_tags.push(tag.name);
							if (tag.category === 'evil') profile_data.bad_tags.push(tag.name);
						});
					}
				}
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
				save_settings();
			}
			async function mannco() {
				const response = await webrequest(`get`, `https://mannco.store/bots`);
				if (!response) return;

				const bots = [...new Set(response.match(pattern.steamid))];  // Remove duplicates from our request
				sap_extension.data.bot_profiles.mannco = bots;

				log(`Got ${bots.length} Mannco.Store bots`);
				sap_extension.data.bot_profiles.last_check = time.current_time();
				save_settings();
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
				save_settings();
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
			save_settings();

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
			save_settings();
		}
	}
};
