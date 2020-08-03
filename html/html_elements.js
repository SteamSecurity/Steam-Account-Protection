const html_elements = {
	multi: {
		impersonator_warning: (active_user, impersonated_user) => {
			let impersonated_user_data;

			if (impersonated_user.type === 'bot')
				impersonated_user_data = `<div class="text">Potentially impersonated user</div>
						<div>Service: <span class="description-value">${impersonated_user.personaname_display}</span></div>
						<div>Link: <a class="description-value" href="${impersonated_user.link}" target="_blank">${impersonated_user.link}</a></div>`;
			else
				impersonated_user_data = `<div class="text">Potentially impersonated user</div>
						<div>Persona: <span class="description-value">${impersonated_user.personaname}</span></div>
						<div>Link: <a class="description-value" href="https://steamcommunity.com/profiles/${impersonated_user.steamid}" target="_blank">${impersonated_user.steamid}</a></div>`;

			return `<div id="sap-impersonator-overlay" style="display:none; opacity:0" class="sap-overlay">
		<div class="overlay-content">
			<div class="top-bar"></div>
			<div class="title">Impersonator Warning</div>
				<div class="profile-container">
					<div class="text">This user may be impersonating another Steam user.<br>Please be careful when interacting with this user.</div>
			</div>
			<div class="profile-container">
					<div class="image-container">
						<img class="profile-icon" src="${active_user.profile_picture}">
						<img class="profile-icon frame" src="${active_user.profile_frame}" alt="">
					</div>

					<div class="description">
						<div class="text">This profile</div>
						<div>Persona: <span class="description-value">${active_user.personaname}</span></div>
						<div>SteamID: <span class="description-value">${active_user.steamid}</span></div>
					</div>
			</div>

			<div class="profile-container">
					<div class="image-container">
						<img class="profile-icon" src="${impersonated_user.profile_picture}">
						<img class="profile-icon frame" src="${impersonated_user.profile_frame}" alt="">
					</div>

					<div class="description">
						${impersonated_user_data}
					</div>
			</div>
			<div class="button-container">
				<a class="button btn_big" id="close-impersonator-overlay">Close</a>
			</div>
		</div>
	</div>`;
		},
		reputation_warning: () => `<div id="sap-reputation-overlay" style="display:none; opacity:0" class="sap-overlay">
		<div class="overlay-content">
			<div class="top-bar"></div>
			<div class="title">Reputation Warning</div>
				<div class="profile-container">
					<div class="text">This user has at least one negative reputation tag.<br>Please be careful when interacting with them.</div>
			</div>
			<div class="button-container">
				<a class="button btn_big" id="close-reputation-overlay">Close</a>
			</div>
		</div>
	</div>`

	},
	settings: {
		buddy_container: (buddy) => `<div class="profile-container" >
				<img class="profile-icon" src="${buddy.profile_picture}">
				<div class="description">
					<div>Persona: <span class="description-value">${buddy.personaname}</span></div>
					<div>Level: <span class="description-value">${buddy.level}</span></div>
					<div>SteamID: <span class="description-value">${buddy.steamid}</span></div>
					<div class="button-container">
						<a class="button btn_bad" data-function="remove_buddy" data-target="${buddy.steamid}">Remove</a>
					</div>
				</div>
			</div>`
	},
	trade_window: {
		api_warning: `<div class="trade_partner_info_block group" style="display:flex; border: 1px solid #5faad7">
		<div style="text-align: center; font-size: 1.4em; color:white;margin:auto;">
			<div>API Key Warning!</div>
		</div>
	</div>`,
		trade_toolbar: (profile) => `
		<div class="trade-header"><span>Trade offer with&nbsp;<a class="steam-highlight" target="_blank" href="https://steamcommunity.com/profiles/${profile.steamid}">${profile.personaname}</a></span></div>
		<div id="trade-toolbar" class="trade_partner_info_block group">
			<div class="body" style="text-align: center; font-size: 1.4em; color:white;margin:auto;">
				<a class="button bpanel btn_active " data-target="partner"><span>Partner Info</span></a>
				<a id="reputation-button" class="button bpanel hidden" data-target="reputation"><span>Reputation</span></a>
				<!--<a class="button" id="open-partner-inventory" data-target="inventory"><span>Inventory</span></a>-->
				<a id="warning-button" class="button bpanel hidden" data-target="warnings"><span>Warnings</span></a>
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
				<div class="partner-info-container">
					<span>Account age: <span class="steam-highlight">${steam.account_age(profile.account_creation_date)}</span></span>
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
		</div>`,
		trade_toolbar_box: (text) => `<div class="partner-info-container"><span class="warning-text">${text}</span></div>`
	},
	profile: {
		reputation_panel: (profile) => `<div id="reputation-panel" class="profile_customization" style="height:auto;">
		<div id="reputation-panel-title" class="profile_customization_header ellipsis">${profile.personaname}'s Reputation</div>
		<div class="profile_customization_block">
			<div class="customtext_showcase">
				<div class="showcase_content_bg showcase_notes">
					<div style="padding:2px; display:block">
						<p>
							<b>SteamRep:</b> <a id="reputation-panel-steamrep" target="_blank" href="https://steamrep.com/profiles/${profile.steamid}">Loading...</a>
						</p>
						<p>
							<b>Pending Reports:</b> <a id="reputation-panel-pendingreports" target="_blank" href="https://steamrep.com/profiles/${profile.steamid}">Loading...</a>
						</p>
						<p>
							<b>Perm Link:</b> <a id="reputation-panel-permlink" href="javascript:;" onclick="event.preventDefault(); let sel = window.getSelection(); let range = document.createRange(); range.selectNodeContents(this); sel.removeAllRanges(); sel.addRange(range); document.execCommand('copy')">https://steamcommunity.com/profiles/${profile.steamid}</a>
						</p>
						<p>
							<b>SteamID64:</b> <input id="reputation-panel-steamid" type="text" style="text-align: center;" readonly onclick="this.select(); document.execCommand('copy')" value="${profile.steamid}"/>
						</p>
						
						<div style="margin-top:15px;display:flex;">
	
							<a id="reputation-panel-reptf" target="_blank" href="https://rep.tf/${profile.steamid}" class="reputation-panel-service">
								<img src="https://rep.tf/favicon.ico"/>
								<div>Rep.tf</div>
							</a>
	
							<a id="reputation-panel-backpacktf" target="_blank" href="https://backpack.tf/profiles/${profile.steamid}" class="reputation-panel-service">
								<img src="https://backpack.tf/favicon.ico" />
								<div></span>Backpack.tf</div>
							</a>
	
							<a id="reputation-panel-bazaartf" target="_blank" href="https://bazaar.tf/profiles/${profile.steamid}" class="reputation-panel-service">
							<img src="https://bazaar.tf/favicon.ico"  />
								<div>Bazaar.tf</div>
							</a>
	
							<a id="reputation-panel-scraptf" target="_blank" href="https://scrap.tf/profile/${profile.steamid}" class="reputation-panel-service">
							<img src="https://scrap.tf/favicon.ico"  />
								<div>Scrap.tf</div>
							</a>
							
						</div>
						<div style="margin-top:15px;display:flex;">
							<a id="reputation-panel-marketplacetf" target="_blank" href="https://marketplace.tf/shop/${profile.steamid}" class="reputation-panel-service">
								<img src="https://marketplace.tf/favicon.ico"  />
								<div>Marketplace.tf</div>
							</a>

							<a id="reputation-panel-steamiduk" target="_blank" href="https://steamid.eu/profile/${profile.steamid}" class="reputation-panel-service">
							<img src="https://steamid.uk/favicon.ico"  />
								<div>SteamID.uk</div>
							</a>
							<a id="reputation-panel-steamtrades" target="_blank" href="https://steamtrades.com/user/${profile.steamid}" class="reputation-panel-service">
								<img src="https://cdn.steamtrades.com/img/favicon.ico"  />
								<div>Steam Trades</div>
							</a>
							<a id="reputation-panel-google" target="_blank" href="https://duckduckgo.com/search?q=%22${profile.steamid}%22" class="reputation-panel-service">
								<img src="https://duckduckgo.com/favicon.ico"/>
								<div>DuckDuckGo</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
		buddy_button: `<div id="buddy-button" class="btn_profile_action btn_medium"><span style="display:flex; padding: 5px;"><img style="height: 20px;" src="${chrome.extension.getURL('img/icons/user.png')}"></span></div>`,
		buddy_add_warning: (profile = { personaname: 'none', level: 0, steamid: 0 }) => `<div style="display:none; opacity:0" id="sap-buddy-confirm-overlay" class="sap-overlay">
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
}