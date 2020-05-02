const html_elements = {
	multi: {
		impersonator_warning: () => {
			let body_data;
			if (loc.result === `trade_offer`) {
				body_data = { subtitle: `Please exercise caution when trading`, partner_header: `Your Trade Partner:`, main_user_header: `Potentialy Impersonated:` };
			} else {
				body_data = { subtitle: `Please verify this user is who you think it is.`, partner_header: `This user:`, main_user_header: `Potentialy Impersonated:` };
			}

			return `<div class="overlay">
			<div id="impersonator-warning" class="overlay-content">
				<div class="title">Impersonator Warning</div>
				<div class="desc">${body_data.subtitle}</div>
				<div class="body">
					<div class="header-desc">${body_data.partner_header}</div> <a id="impersonator-partner-url" target="__blank"
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
						target="__blank" class="box-desc" href="https://steamcommunity.com"> <img
							id="impersonator-impersonated-profile-picture" title="This user's Profile Picture" src="">
						<div class="box-main">
							<div id="impersonator-impersonated-personaname" title="This user's Persona name"></div>
							<div id="impersonator-impersonated-steamid" title="This user's Steam ID"></div>
						</div>
						<div class="box-level">
							<div class="trade_partner_steam_level">
								<div title="This user's Steam Level" class="friendPlayerLevel"> <span
										id="impersonator-impersonated-level" class="friendPlayerLevelNum"></span> </div>
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
				body_data = { subtitle: `Please exercise caution when trading`, partner_header: `Your Trade Partner:`, main_user_header: `Potentialy Impersonated:` };
			} else {
				body_data = { subtitle: `Please verify this user is who you think it is.`, partner_header: `This user:`, main_user_header: `Potentialy Impersonated:` };
			}
			return `<div class="overlay">
			<div id="bot-impersonator-warning" class="overlay-content">
				<div class="title">Bot Impersonator Warning</div>
				<div class="desc">${body_data.subtitle}</div>
				<div class="body">
					<div class="header-desc">${body_data.partner_header}</div>
					<a id="bot-impersonator-partner-url" target="__blank" class="box-desc">
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
	settings:{
		buddy_container: (buddy) => {
			return `<div class="buddy-container">
			<div class="profile_picture"><img
					src="${buddy.profile_picture.replace('_full.jpg', '_medium.jpg')}" alt="PFP"></div>
			<a class="identifiers" href="https://steamcommunity.com/profiles/${buddy.steamid}" target="__blank">
				<span>${buddy.personaname}</span>
				<span>${buddy.steamid}</span>
			</a>
			<div class="actions" data-steamid="${buddy.steamid}">X</div>
		</div>`
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
		trade_toolbar: `
		<div id="trade-toolbar" class="trade_partner_info_block group" style="display:flex; border: 1px solid #5faad7">
			<div class="body" style="text-align: center; font-size: 1.4em; color:white;margin:auto;">
				<button class="button bpanel" id="trade-toolbar-open-reputation" ><span>Reputation</span></button>
				<button class="button" id="trade-toolbar-open-backpacktf" ><span>Backpack.TF</span></button>
				<button class="button bpanel"id="trade-toolbar-open-warnings"><span>Warnings</span></button>
			</div>
				<div id="trade-toolbar-reputation" class="trade-toolbar-info-box invisible">
				<div id="trade-toolbar-disabled-notice" class="warning" style="display:none;">Reputation Scanner Disabled!</div>
				<div id="trade-toolbar-rep-steamBans" class="community-container"> <div class="community-title">Steam</div> </div> 
				<div id="trade-toolbar-rep-stfBans" class="community-container"> <div class="community-title">Scrap.tf</div> </div> 
				<div id="trade-toolbar-rep-mpBans" class="community-container"> <div class="community-title">Marketplace.tf</div> </div> 
				<div id="trade-toolbar-rep-bzBans" class="community-container"> <div class="community-title">Bazaar.tf</div> </div> 
				<div id="trade-toolbar-rep-ppmBans" class="community-container"> <div class="community-title">PPM</div> </div> 
				<div id="trade-toolbar-rep-hgBans" class="community-container"> <div class="community-title">Harpoon</div> </div> 
				<div id="trade-toolbar-rep-nhsBans" class="community-container"> <div class="community-title">Neon Heights</div> </div> 
				<div id="trade-toolbar-rep-stBans" class="community-container"> <div class="community-title">SMT</div> </div> 
				<div id="trade-toolbar-rep-fogBans"class="community-container"> <div class="community-title">FoG Trade</div> </div> 
				<div id="trade-toolbar-rep-etf2lBans" class="community-container"> <div class="community-title">ETF2L</div> </div> 
				<div id="trade-toolbar-rep-bptfBans" class="community-container"> <div class="community-title">Backpack.tf</div> </div> 
				<div id="trade-toolbar-rep-srBans" class="community-container"> <div class="community-title">SteamRep</div> </div>
			</div>
			<div id="trade-toolbar-backpacktf" class="trade-toolbar-info-box invisible">Backpack.TF!</div>
			<div id="trade-toolbar-warnings" class="trade-toolbar-info-box invisible">
				<div id="trade-toolbar-warnings-list">
					<div id="trade-toolbar-warning-community-bans" class="warning" style="display:none;">Banned from at least one community!</div>
					<div id="trade-toolbar-warning-bot-impostor" class="warning" style="display:none;">May be impersonating a trading bot!</div>
					<div id="trade-toolbar-warning-user-impostor" class="warning" style="display:none;">May be impersonating a trusted user!</div>
				</div>
			</div>
		</div>`
	},
	profile: {
		reputation_panel: `<div id="reputation-panel" class="profile_customization" style="height:auto;">
		<div id="reputation-panel-title" class="profile_customization_header ellipsis">User Reputation</div>
		<div class="profile_customization_block">
			<div class="customtext_showcase">
				<div class="showcase_content_bg showcase_notes">
					<div style="padding:2px; display:block">
						<p>
							<b>Steam Rep:</b>
							<a id="reputation-panel-steamrep" target="_blank" href="https://steamrep.com/profiles/">Loading...</a>
						</p>
						<p>
							<b>Pending Reports:</b>
							<a id="reputation-panel-pendingreports" target="_blank" href="https://steamrep.com/profiles/">Loading...</a>
						</p>
						<p>
							<b>Perm Link:</b>
							<a id="reputation-panel-permlink" href="javascript:;"
								onclick="event.preventDefault(); let sel = window.getSelection(); let range = document.createRange(); range.selectNodeContents(this); sel.removeAllRanges(); sel.addRange(range); document.execCommand('copy')">Loading...</a>
						</p>
						<p>
							<b>SteamID64:</b>
							<input id="reputation-panel-steamid" type="text" style="text-align: center;" readonly
								onclick="this.select(); document.execCommand('copy')" value="Loading..."/>
						</p>
						<div style="margin-top:15px;display:flex;">
	
							<a id="reputation-panel-reptf" target="_blank" href="" class="reputation-panel-service">
								<img src=""/>
								<div>Rep.tf</div>
							</a>
	
							<a id="reputation-panel-backpacktf" target="_blank" href="" class="reputation-panel-service"><img
									src="" />
								<div></span>Backpack.tf</div>
							</a>
	
							<a id="reputation-panel-bazaartf" target="_blank" href="" class="reputation-panel-service"><img
									src=""  />
								<div>Bazaar.tf</div>
							</a>
	
							<a id="reputation-panel-scraptf" target="_blank" href="" class="reputation-panel-service"><img
									src=""  />
								<div>Scrap.tf</div>
							</a>
							
						</div>
						<div style="margin-top:15px;display:flex;">
							<a id="reputation-panel-marketplacetf" target="_blank" href="" class="reputation-panel-service">
								<img src=""/>
								<div>Marketplace.tf</div>
							</a>

							<a id="reputation-panel-steamiduk" target="_blank" href="" class="reputation-panel-service">
								<img src=""/>
								<div>SteamID.uk</div>
							</a>
							<a id="reputation-panel-steamtrades" target="_blank" href="" class="reputation-panel-service">
								<img src="" />
								<div>Steam Trades</div>
							</a>
							<a id="reputation-panel-google" target="_blank" href="" class="reputation-panel-service">
								<img src=""/>
								<div>Google</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
		buddy_button: `<div id="buddy-button" class="btn_profile_action btn_medium"><span style="display:flex; padding: 5px;"><img style="height: 20px;" src="${chrome.extension.getURL('images/user.png')}"></span></div>`,
		buddy_add_warning: `<div class="overlay">
		<div id="buddy-warning" class="overlay-content">
			<div class="title">Buddy This User?</div>
			<div class="body">
				<div class="header-desc">This user:</div> <div 
					class="box-desc"> <img id="buddy-partner-profile-picture" title="This user's Profile Picture"
						src="">
					<div class="box-main">
						<div id="buddy-partner-personaname" title="This user's Persona name"></div>
						<div id="buddy-partner-steamid" title="This user's Steam ID"></div>
					</div>
					<div class="box-level">
						<div class="trade_partner_steam_level">
							<div title="This user's Steam Level" class="friendPlayerLevel"> <span
									id="buddy-partner-level" class="friendPlayerLevelNum"></span> </div>
						</div>
					</div>
				</div>
				<div id="buddy-add" class="close-overlay">Add user as buddy</div>
				<div id="buddy-close" class="close-overlay">Close</div>
			</div>
		</div>
	</div>`
	}
};