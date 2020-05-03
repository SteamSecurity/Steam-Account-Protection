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
					if (reptf_data.steamid === steamid) {
						profile_reputation = reptf_data;
					}
				});

				if (profile_reputation) {
					if (time.current_time() <= profile_reputation.last_check + 3600) {
						log(`Using saved Reptf reputation of ${profile_reputation.steamid}`);
						resolve(profile_reputation);
						return;
					}
				}

				// Sends request to reptf
				let raw_response = JSON.parse(await xhr_send(`post`, `https://rep.tf/api/bans?str=${steamid.toString()}`));

				if (raw_response.success !== true) {
					reject(raw_response.message);
				}

				// Filters the Object Keys in the response to only include communities
				let communities = Object.keys(raw_response).filter(is_community);

				// Saves data to a more simple object
				communities.forEach((community_name) => {
					ban_data.bans[community_name] = {
						banned: null,
						message: null
					};
					if (raw_response[community_name].banned === `good` || raw_response[community_name].banned === false) {
						ban_data.bans[community_name].banned = false;
					}
					if (raw_response[community_name].banned === `bad` || raw_response[community_name].banned === true) {
						ban_data.bans[community_name].banned = true;
					}
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
					if (steamrep_data.steamid === steamid) {
						profile_reputation = steamrep_data;
					}
				});

				if (profile_reputation) {
					if (time.current_time() <= profile_reputation.last_check + 3600) {
						log(`Using saved SteamRep reputation of ${profile_reputation.steamid}`);
						resolve(profile_reputation);
						return;
					}
				}

				let raw_response = JSON.parse(await xhr_send(`get`, `https://steamrep.com/api/beta4/reputation/${steamid}?extended=1&json=1&tagdetails=1`)).steamrep;
				// Sets the check time. This will help prevent spamming requests
				profile_data.last_check = time.current_time();

				// Sets Pending Reports
				profile_data.pending_reports = raw_response.stats.unconfirmedreports.reportcount;
				profile_data.pending_reports_link = raw_response.stats.unconfirmedreports.reportlink;

				// If there are no special tags, return
				if (raw_response.reputation.tags !== ``) {
					// Steamrep doesn't use an array for people with a single tag
					if (!raw_response.reputation.tags[0]) {
						if (raw_response.reputation.tags.tag.category == 'trusted') {
							profile_data.good_tags.push(raw_response.reputation.tags.tag.name);
						}

						if (raw_response.reputation.tags.tag.category == 'evil') {
							profile_data.bad_tags.push(raw_response.reputation.tags.tag.name);
						}
					}

					// If we do have an array, we have more than one tag to categorize
					if (raw_response.reputation.tags[0]) {
						raw_response.reputation.tags.tag.forEach(function (tag) {
							if (tag.category == 'trusted') {
								profile_data.good_tags.push(tag.name);
							}
							if (tag.category == 'evil') {
								profile_data.bad_tags.push(tag.name);
							}
						});
					}
				}

				// Saves the data so we won't have to query steamrep until SAP registers the data as out of date
				sap_extension.data.user_profiles.steamrep_profiles.push(profile_data);
				save_settings();

				// Return the data
				resolve(profile_data);
			});
		}
	},
	update: {
		bots: () => {
			let bot_update_data = {
				request_status: {
					marketplace: false,
					mannco: false,
					bitskins: false
				},
				pattern: {
					steamid: /7[0-9]{16}/g,
					xml_next_page: /<nextPageLink>[!-z]+<\/nextPageLink>/g,
					xml_total_pages: /<totalPages>[0-9]+<\/totalPages>/g,
					number: /[0-9]+/
				}
			};
			if (sap_extension.data.bot_profiles.last_check + 86400 <= time.current_time()) {
				marketplace();
				mannco();
				bitskins();
				return;
			}
			log(`Not updating Bot list`);
			return;
			async function marketplace() {
				let response = JSON.parse(await xhr_send(`get`, `https://marketplace.tf/api/Bots/GetBots/v2`));
				if (response.success) {
					let bots = []; // Array of SteamID64s
					response.bots.forEach((bot) => {
						bots.push(bot.steamid);
					});
					sap_extension.data.bot_profiles.marketplace = bots;
					log(`Got ${response.bots.length} Marketplace.tf bots!`);
				}
				bot_update_data.request_status.marketplace = true;
				check_states();
			}
			async function mannco() {
				let request = await xhr_send(`get`, `https://mannco.store/bots`);
				let bots_raw = request.match(bot_update_data.pattern.steamid);
				let bots = [];
				// Remove duplicates from our request
				bots_raw.forEach((bot) => {
					if (!bots.includes(bot)) {
						bots.push(bot);
					}
				});
				sap_extension.data.bot_profiles.mannco = bots;
				bot_update_data.request_status.mannco = true;
				log(`Got ${bots.length} Mannco.Store bots!`);
				check_states();
			}
			async function bitskins() {
				let bots = [];
				let page = 1;

				while (true) {
					log(`Getting Bitskins page ${page}`);
					let page_data = await xhr_send(`get`, `https://steamcommunity.com/groups/bitskinsbots/memberslistxml/?xml=1&p=${page}`);
					page_data.match(bot_update_data.pattern.steamid).map((steamid) => bots.push(steamid));
					if (page_data.match(bot_update_data.pattern.xml_next_page) && page <= 15) {
						page++;
						continue;
					}
					break;
				}

				sap_extension.data.bot_profiles.bitskins = bots;
				bot_update_data.request_status.bitskins = true;
				log(`Got ${bots.length} Bitskins bots!`);
				check_states();
			}
			function check_states() {
				let { marketplace, mannco, bitskins } = bot_update_data.request_status;
				if (marketplace && mannco && bitskins) {
					console.log(sap_extension.data.bot_profiles);
					sap_extension.data.bot_profiles.last_check = time.current_time();
					log(`Finished getting Bots!`);
					save_settings();
				}
			}
		},
		user_profiles: async () => {
			if (sap_extension.data.user_profiles.last_check + 86400 <= time.current_time()) {
				let bots = []; // Should be called "users", but it's not for consistency
				let response = JSON.parse(await xhr_send(`get`, `https://backpack.tf/api/IGetUsers/GetImpersonatedUsers`));
				response = response.results.filter(not_marketplace);
				response.forEach((user) => bots.push(format_user(user)));

				log(`Got ${bots.length} Backpack.tf Impersonated users!`);
				sap_extension.data.user_profiles.impersonated = bots;
				sap_extension.data.user_profiles.last_check = time.current_time();
				save_settings();
				return;
			}
			log(`Not updating impersonated list`);
			return;

			// Makes sure the user is not from Marketplace.tf
			function not_marketplace(user) {
				return !/Marketplace.TF \| Bot ([0-9]+)/i.test(user.personaname);
			}
			// Returns a user object properly formatted for SAP
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
			sap_extension.data.user_profiles;
		}
	}
};
