const html_elements = {
	multi: {
		impersonator_warning: () => {
			let body_data;
			if (loc.result === `trade_offer`) {
				body_data = { subtitle: `Please exercise caution when trading`, partner_header: `Your Trade Partner:`, main_user_header: `Potentially Impersonated:` };
			} else {
				body_data = { subtitle: `Please verify this user is who you think it is.`, partner_header: `This user:`, main_user_header: `Potentially Impersonated:` };
			}

			return `<div class="overlay">
			<div id="impersonator-warning" class="overlay-content">
				<div class="title">Impersonator Warning</div>
				<div class="desc">${body_data.subtitle}</div>
				<div class="body">
					<div class="header-desc">${body_data.partner_header}</div> <a id="impersonator-partner-url" target="_blank"
						class="box-desc"> <img id="impersonator-partner-profile-picture" title="This user's Profile Picture"
							src="">
						<div class="box-main">
							<div id="impersonator-partner-personaname" title="This user's Persona name"></div>
							<div id="impersonator-partner-steamid" title="This user's Steam ID"></div>
						</div>
						<div class="box-level">
							<div class="trade_partner_steam_level">
								<div title="This user's Steam Level" class="friendPlayerLevel"> <span
										id="impersonator-partner-level" class="friendPlayerLevelNum"></span> </div>
							</div>
						</div>
					</a>
					<div class="header-desc">${body_data.main_user_header}</div> <a id="impersonator-impersonated-url"
						target="_blank" class="box-desc" href="https://steamcommunity.com"> 
							<img id="impersonator-impersonated-profile-picture" title="This user's Profile Picture" src="">
						<div class="box-main">
							<div id="impersonator-impersonated-personaname" title="This user's Persona name"></div>
							<div id="impersonator-impersonated-steamid" title="This user's Steam ID"></div>
						</div>
						<div class="box-level">
							<div class="trade_partner_steam_level">
								<div title="This user's Steam Level" class="friendPlayerLevel"> 
								<span id="impersonator-impersonated-level" class="friendPlayerLevelNum"></span> </div>
							</div>
						</div>
					</a>
					<div id="impersonator-close" class="close-overlay">Click here to close</div>
				</div>
			</div>
		</div>`;
		},
		bot_impersonator_warning: () => {
			let body_data;
			if (loc.result === `trade_offer`) {
				body_data = { subtitle: `Please exercise caution when trading`, partner_header: `Your Trade Partner:`, main_user_header: `Potentially Impersonated:` };
			} else {
				body_data = { subtitle: `Please verify this user is who you think it is.`, partner_header: `This user:`, main_user_header: `Potentially Impersonated:` };
			}
			return `<div class="overlay">
			<div id="bot-impersonator-warning" class="overlay-content">
				<div class="title">Bot Impersonator Warning</div>
				<div class="desc">${body_data.subtitle}</div>
				<div class="body">
					<div class="header-desc">${body_data.partner_header}</div>
					<a id="bot-impersonator-partner-url" target="_blank" class="box-desc">
						<img id="bot-impersonator-partner-profile-picture" title="This user's Profile Picture" src="">
						<div class="box-main">
							<div id="bot-impersonator-partner-personaname" title="This user's Persona name"></div>
							<div id="bot-impersonator-partner-steamid" title="This user's Steam ID"></div>
						</div>
					</a>
					<div class="header-desc">${body_data.main_user_header}</div>
					<div id="bot-impersonator-impersonated-url" class="box-desc">
						<img id="bot-impersonator-impersonated-profile-picture" title="This user's Profile Picture" src="">
						<div class="box-main">
							<div id="bot-impersonator-impersonated-personaname" title="This user's Persona name"></div>
							<div>
							</div>
						</div>
					</div>
					<div id="bot-impersonator-close" class="close-overlay">Click here to close</div>
				</div>
			</div>
		</div>`;
		}
	},
	settings: {
		buddy_container: (buddy) => {
			//TODO: Check if "return" is needed. It shouldn't be 
			return `<div class="profile-container">
				<img class="profile-icon" src="${buddy.profile_picture}">
				<div class="description">
					<div>Persona: <span class="description-value">${buddy.personaname}</span></div>
					<div>Level: <span class="description-value">${buddy.level}</span></div>
					<div>SteamID: <span class="description-value">${buddy.steamid}</span></div>
					<div class="button-container">
						<a class="button btn_bad" data-function="remove_buddy" data-target="${buddy.steamid}">Remove</a>
					</div>
				</div>
			</div>`;
		}
	},
	trade_window: {
		api_warning: `<div class="trade_partner_info_block group" style="display:flex; border: 1px solid #5faad7">
		<div style="text-align: center; font-size: 1.4em; color:white;margin:auto;">
			<div>API Key Warning!</div>
		</div>
	</div>`,
		reputation_warning: `<div class="overlay">
		<div id="reputation-warning" class="overlay-content">
			<div class="title">Reputation Warning</div>
			<div class="desc">Please exercise caution when trading</div>
			<div class="body">
				<div id="rep-steamBans" class="community-container">
					<div class="community-title">Steam</div>
				</div>
				<div id="rep-stfBans" class="community-container">
					<div class="community-title">Scrap.tf</div>
				</div>
				<div id="rep-mpBans" class="community-container">
					<div class="community-title">Marketplace.tf</div>
				</div>
				<div id="rep-bzBans" class="community-container">
					<div class="community-title">Bazaar.tf</div>
				</div>
				<div id="rep-ppmBans" class="community-container">
					<div class="community-title">PPM</div>
				</div>
				<div id="rep-hgBans" class="community-container">
					<div class="community-title">Harpoon</div>
				</div>
				<div id="rep-nhsBans" class="community-container">
					<div class="community-title">Neon Heights</div>
				</div>
				<div id="rep-stBans" class="community-container">
					<div class="community-title">SMT</div>
				</div>
				<div id="rep-fogBans" class="community-container">
					<div class="community-title">FoG Trade</div>
				</div>
				<div id="rep-etf2lBans" class="community-container">
					<div class="community-title">ETF2L</div>
				</div>
				<div id="rep-bptfBans" class="community-container">
					<div class="community-title">Backpack.tf</div>
				</div>
				<div id="rep-srBans" class="community-container">
					<div class="community-title">SteamRep</div>
				</div>
			</div>
			<div id="reputation-warning-close" class="close-overlay">Click here to close</div>
		</div>
	</div>`,
		trade_toolbar: (profile) => `
		<div class="trade-header"><span>Trade offer with&nbsp;<a class="steam-highlight" target="_blank" href="https://steamcommunity.com/profiles/${profile.steamid}">${profile.personaname}</a></span></div>
		<div id="trade-toolbar" class="trade_partner_info_block group">
			<div class="body" style="text-align: center; font-size: 1.4em; color:white;margin:auto;">
				<a class="button bpanel btn_active" data-target="partner"><span>Partner Info</span></a>
				<a class="button bpanel" data-target="reputation"><span>Reputation</span></a>
				<!--<a class="button" id="open-partner-inventory" data-target="inventory"><span>Inventory</span></a>-->
				<a class="button bpanel" data-target="warnings"><span>Warnings</span></a>
			</div>
			<div class="info-box" id="trade-toolbar-partner">
				<div class="partner-info-container">
					<span><span class="${profile.is_friend ? `sap-good` : `sap-warning`}">${profile.is_friend ? `${profile.personaname} is a friend!` : `${profile.personaname} is NOT a friend!`}</span></span>
				</div>
				<div class="partner-info-container">
					<span>Account level: <span class="friendPlayerLevel ${steam.level_class(profile.level)}">${profile.level}</span></span>
				</div>
				<div class="partner-info-container">
					<span>Account created: <span class="steam-highlight">${profile.account_creation_date}</span></span>
				</div>
				<!--TODO: Create function to more accurately display the account creation date-->
				<div class="partner-info-container">
					<span>Account age: <span class="steam-highlight">${new Date().getFullYear() - Number(profile.account_creation_date.split(`, `)[1])} years</span></span>
				</div>
			</div>
			<div class="info-box hidden" id="trade-toolbar-reputation">
				<div class="partner-info-container">
					<span>Reputation: <span id="reputation-results"></span></span>
				</div>
				<div class="partner-info-container">
					<span>Checked: <span id="reputation-last-check"></span></span>
				</div>
				<div class="partner-info-container">
					<span><a class="button btn_secondary" target="_blank" href="https://rep.tf/${profile.steamid}">Check Rep.TF</a> <a class="button btn_secondary" target="_blank" href="https://steamrep.com/search?q=${profile.steamid}">Check SteamRep</a></span>
				</div>
			</div>
			<div class="info-box hidden" id="trade-toolbar-inventory"></div>
			<div class="info-box hidden" id="trade-toolbar-warnings"></div>
		</div>`
	},
	profile: {
		reputation_panel: (profile) => `<div id="reputation-panel" class="profile_customization" style="height:auto;">
		<div id="reputation-panel-title" class="profile_customization_header ellipsis">${profile.personaname}'s Reputation</div>
		<div class="profile_customization_block">
			<div class="customtext_showcase">
				<div class="showcase_content_bg showcase_notes">
					<div style="padding:2px; display:block">
						<p>
							<b>Steam Rep:</b>
							<a id="reputation-panel-steamrep" target="_blank" href="https://steamrep.com/profiles/${profile.steamid}">Loading...</a>
						</p>
						<p>
							<b>Pending Reports:</b>
							<a id="reputation-panel-pendingreports" target="_blank" href="https://steamrep.com/profiles/${profile.steamid}">Loading...</a>
						</p>
						<p>
							<b>Perm Link:</b>
							<a id="reputation-panel-permlink" href="javascript:;"
								onclick="event.preventDefault(); let sel = window.getSelection(); let range = document.createRange(); range.selectNodeContents(this); sel.removeAllRanges(); sel.addRange(range); document.execCommand('copy')">https://steamcommunity.com/profiles/${profile.steamid}</a>
						</p>
						<p>
							<b>SteamID64:</b>
							<input id="reputation-panel-steamid" type="text" style="text-align: center;" readonly
								onclick="this.select(); document.execCommand('copy')" value="${profile.steamid}"/>
						</p>
						<div style="margin-top:15px;display:flex;">
	
							<a id="reputation-panel-reptf" target="_blank" href="https://rep.tf/${profile.steamid}" class="reputation-panel-service">
								<img src=""/>
								<div>Rep.tf</div>
							</a>
	
							<a id="reputation-panel-backpacktf" target="_blank" href="https://backpack.tf/profiles/${profile.steamid}" class="reputation-panel-service"><img
									src="" />
								<div></span>Backpack.tf</div>
							</a>
	
							<a id="reputation-panel-bazaartf" target="_blank" href="https://bazaar.tf/profiles/${profile.steamid}" class="reputation-panel-service"><img
									src=""  />
								<div>Bazaar.tf</div>
							</a>
	
							<a id="reputation-panel-scraptf" target="_blank" href="https://scrap.tf/profile/${profile.steamid}" class="reputation-panel-service"><img
									src=""  />
								<div>Scrap.tf</div>
							</a>
							
						</div>
						<div style="margin-top:15px;display:flex;">
							<a id="reputation-panel-marketplacetf" target="_blank" href="https://marketplace.tf/shop/${profile.steamid}" class="reputation-panel-service">
								<img src=""/>
								<div>Marketplace.tf</div>
							</a>

							<a id="reputation-panel-steamiduk" target="_blank" href="https://steamid.eu/profile/${profile.steamid}" class="reputation-panel-service">
								<img src=""/>
								<div>SteamID.uk</div>
							</a>
							<a id="reputation-panel-steamtrades" target="_blank" href="https://steamtrades.com/user/${profile.steamid}" class="reputation-panel-service">
								<img src="" />
								<div>Steam Trades</div>
							</a>
							<a id="reputation-panel-google" target="_blank" href="https://google.com/search?q=%22${profile.steamid}%22" class="reputation-panel-service">
								<img src=""/>
								<div>Google</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
		buddy_button: `<div id="buddy-button" class="btn_profile_action btn_medium"><span style="display:flex; padding: 5px;"><img style="height: 20px;" src="${chrome.extension.getURL('images/icons/user.png')}"></span></div>`,
		buddy_add_warning: (profile = { personaname: 'none', level: 0, steamid: 0 }) => `<div style="display:none;" id="sap-buddy-confirm-overlay" class="sap-overlay">
		<div class="overlay-content">
			<div class="top-bar"></div>
			<div class="title">Confirm Buddy</div>
			<div class="profile-container">
				<div class="image-container">
					<img class="profile-icon" src="${profile.profile_picture}">
					<img class="profile-icon frame" src="${profile.profile_frame}" alt="">
				</div>

				<div class="description">
					<div>Persona: <span class="description-value">${profile.personaname}</span></div>
					<div>Level: <span class="description-value">${profile.level}</span></div>
					<div>SteamID: <span class="description-value">${profile.steamid}</span></div>
				</div>
			</div>
			<div class="button-container">
				<a class="button btn_good" id="confirm-buddy">Confirm</a>
				<a class="button" id="close-buddy">Close</a>
			</div>
		</div>
	</div>`
	}
};