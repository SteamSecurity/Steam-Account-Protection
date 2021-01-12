const html_elements = {
	// Overlays
	trustUser: ({ profile_picture, steamid, personaname, level, friends }) => {
		return `<div id="trust-user-overlay" class="sap_overlay_background">
	<div class="ovrly_container">
		<div class="header">CONFIRM TRUST TO USER</div>
		<div class="user_body">
			<img src="${profile_picture}">
			<div class="profile_information">
				<div class="descriptor">Persona: <div>${personaname}</div></div>
				<div class="descriptor">SteamID: <div>${steamid}</div></div>
				<div class="descriptor">Level: <div>${level}</div></div>
				<div class="descriptor">Friends: <div>${friends}</div></div>
			</div>
		</div>
		<div class="button_container">
			<button class="button_good" id="confirm-trust-user">Trust User</button><button class="button_bad" id="abort-trust-user">Cancel</button>
		</div>
	</div>
</div>`;
	},

	// Buttons
	trust_user_button: `<a id="add_user_to_trusted_list" href="#trust_user" class="btn_profile_action btn_medium"><span style="display:flex; padding: 5px;"><img style="height: 20px;" src="${chrome.extension.getURL('img/icons/user.png')}"></span></a>`,


	profile: {
		reputation_panel: (profile) => `<div id="reputation-panel" class="profile_customization">
		<div id="reputation-panel-title" class="profile_customization_header ellipsis">${profile.personaname}'s Reputation</div>
		<div class="profile_customization_block">
			<div class="customtext_showcase">
				<div class="showcase_content_bg showcase_notes">
					<div style="padding:2px; display:block">
						<p>
							<b>SteamRep:</b> <a id="reputation-panel-steamrep" target="_blank" href="https://steamrep.com/profiles/${profile.steamid}">Loading...</a>
						</p>
						<p>
							<b>Reports:</b> <a id="reputation-panel-pendingreports" target="_blank" href="https://steamrep.com/profiles/${profile.steamid}">Loading...</a>
						</p>
						<p>
							<b>Perm Link:</b> <a id="reputation-panel-permlink" href="javascript:;" onclick="event.preventDefault(); let sel = window.getSelection(); let range = document.createRange(); range.selectNodeContents(this); sel.removeAllRanges(); sel.addRange(range); document.execCommand('copy')">https://steamcommunity.com/profiles/${profile.steamid}</a>
						</p>
						<p>
							<b>SteamID64:</b> <input id="reputation-panel-steamid" type="text" style="text-align: center;" readonly onclick="this.select(); document.execCommand('copy')" value="${profile.steamid}"/>
						</p>
						
						<div class="btn_container">
	
							<a id="reputation-panel-reptf" target="_blank" href="https://rep.tf/${profile.steamid}" class="btn_profile_action btn_medium">
							<span>
								<img src="https://rep.tf/favicon.ico"/>
								<div>Rep.tf</div>
							</span>
							</a>
	
							<a id="reputation-panel-backpacktf" target="_blank" href="https://backpack.tf/profiles/${profile.steamid}" class="btn_profile_action btn_medium">
							<span>
								<img src="https://backpack.tf/favicon.ico" />
								<div>Backpack.tf</div>
							</span>

							</a>
	
							<a id="reputation-panel-bazaartf" target="_blank" href="https://bazaar.tf/profiles/${profile.steamid}" class="btn_profile_action btn_medium">
							<span>
								<img src="https://bazaar.tf/favicon.ico"  />
								<div>Bazaar.tf</div>
							</span>
							</a>
	
							<a id="reputation-panel-scraptf" target="_blank" href="https://scrap.tf/profile/${profile.steamid}" class="btn_profile_action btn_medium">
							<span>
								<img src="https://scrap.tf/favicon.ico"  />
								<div>Scrap.tf</div>
							</span>
							</a>
							
						</div>
						<div class="btn_container">
							<a id="reputation-panel-marketplacetf" target="_blank" href="https://marketplace.tf/shop/${profile.steamid}" class="btn_profile_action btn_medium">
							<span>	
								<img src="https://marketplace.tf/favicon.ico"  />
								<div>Marketplace.tf</div>
							</span>
							</a>

							<a id="reputation-panel-steamiduk" target="_blank" href="https://steamid.eu/profile/${profile.steamid}" class="btn_profile_action btn_medium">
							<span>
								<img src="https://steamid.uk/favicon.ico"  />
								<div>SteamID.uk</div>
							</span>
							</a>
							<a id="reputation-panel-steamtrades" target="_blank" href="https://steamtrades.com/user/${profile.steamid}" class="btn_profile_action btn_medium">
							<span>	
								<img src="https://cdn.steamtrades.com/img/favicon.ico"  />
								<div>Steam Trades</div>
							</span>
							</a>
							<a id="reputation-panel-google" target="_blank" href="https://duckduckgo.com/?q=%22${profile.steamid}%22" class="btn_profile_action btn_medium">
							<span>	
								<img src="https://duckduckgo.com/favicon.ico"/>
								<div>DuckDuckGo</div>
							</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
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