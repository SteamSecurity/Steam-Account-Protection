const html_elements = {
	// Overlays
	trustUser: ({ profile }) => {
		return `<div id="trustUser-overlay" class="sap_overlay">
	<div class="overlay_container">
		<div class="overlay_header">CONFIRM TRUST TO USER</div>
		<div class="user_information">
			<img src="${profile.profile_picture}">
			<div class="profile-information">
				<div class="descriptor">Persona: <div>${profile.personaname}</div></div>
				<div class="descriptor">SteamID: <div>${profile.steamid}</div></div>
				<div class="descriptor">Level: <div>${profile.level}</div></div>
				<div class="descriptor">Friends: <div>${profile.friends_count}</div></div>
			</div>
		</div>
		<div class="footer_button_container">
			<button class="button-accept" id="confirm-trustUser">Trust User</button><button id="close-trustUser-overlay">Cancel</button>
		</div>
	</div>
</div>`;
	},

	reputation: (overlay_data) => {
		let reputation_html_list = '';

		for (rep_warning of overlay_data.reputation.bad_tags) {
			reputation_html_list += `<div class="community_ban_report"><div><img src="${chrome.extension.getURL("/img/icons/warning.svg")}"></div><span class="text">${rep_warning}<span></div>`;
		}

		return `<div id="reputation-overlay" class="sap_overlay">
	<div class="overlay_container">
		<div class="overlay_header">REPUTATION WARNING</div>
		<div class="user_information">
			<img class="profile-picture" src="${overlay_data.profile.profile_picture}">
			<div class="reputation_box">
				<div class="sub_header">This user has a poor reputation</div>
				${reputation_html_list}
			</div>
		</div>
		<div class="footer_button_container">
			<button id="close-reputation-overlay">Close</button>
		</div>
	</div>
</div>`;
	},

	impersonator: ({ profile, impersonated_profile }) => {
		log.standard(impersonated_profile);
		return `<div id="impersonator-overlay" class="sap_overlay">
	<div class="overlay_container">
		<div class="overlay_header">IMPERSONATOR DETECTED</div>

		<div class="side_by_side_user_container">
			<div class="user_information user_information_vertical alert">
				<div class="divider_header">This User</div>
					<img style="margin-bottom:5px" src="${profile.profile_picture}">
						<div class="profile-information" style="margin-left:0px">
							<div class="descriptor"><div class="title">Persona:</div> <div>${profile.personaname}</div></div>
							<div class="descriptor"><div class="title">SteamID:</div> <div>${profile.steamid}</div></div>
						</div>
				</div>
			<div class="user_information user_information_vertical">
				<div class="divider_header">Impersonated User</div>
					<img  style="margin-bottom:5px" src="${impersonated_profile.profile_picture || impersonated_profile.avatar.replace('_medium.jpg', '_full.jpg')}">
						<div class="profile-information" style="margin-left:0px">
							<div class="descriptor"><div class="title">Persona:</div> <div>${impersonated_profile.personaname}</div></div>
							<div class="descriptor"><div class="title">SteamID:</div> <a href="https://steamcommunity.com/profiles/${impersonated_profile.steamid}" target="_blank"><div>${impersonated_profile.steamid}</div></a>
					</div>
				</div>
			</div>

		</div>
		<div class="footer_button_container">
			<button id="close-impersonator-overlay">Close</button>
		</div>
	</div>
	</div>`;
	},

	// Buttons
	trust_user_button: `<a id="add_user_to_trusted_list" href="#trust_user" class="btn_profile_action btn_medium"><span style="display:flex; padding: 5px;"><img style="height: 20px;" src="${chrome.extension.getURL('img/icons/user.png')}"></span></a>`,
	untrust_user_button: `<a id="untrust_user" href="#trust_user" class="btn_profile_action btn_medium"><span style="display:flex; padding: 5px;"><img style="height: 20px;" src="${chrome.extension.getURL('img/icons/user_slash.png')}"></span></a>`,

	profileReputation: (profile) => {
		let status;
		if (profile.status === 'Currently In-Game') status = 'user_in-game';
		else if (profile.status === 'Currently Online') status = 'user_online';
		else status = 'user_offline';

		return `<div id="sap_reputation_panel" class="reputation_panel responsive_status_info">
			${!storage.settingIsEnabled('reputation_scanner') ? '<div class="disclaimer hidden"></div>' : ''}
			<div class="header">About</div >
			${profile.status ? `<div class="descriptor">Status: <div class="${status}">${profile.status}</div></div>` : ''}
			${status === 'user_in-game' ? `<div class="descriptor">Game: <div class="user_in-game">${profile.status_summary}</div></div>` : ''}
			${status === 'user_offline' && profile.status_summary ? `<div class="descriptor">Last Online: <div class="user_offline">${profile.status_summary.replace('Last Online ', '')}</div></div>` : ''}
			${profile.lobby.can_join ? `<div class="descriptor"><a class="button_good" href='${profile.lobby.link}'><div>Join Game</div></a></div>` : ''}
			${profile.status ? '<br>' : ''}
			<div class="descriptor">SteamID: <div>${profile.steamid}</div></div>
			<div class="descriptor">Link: <div><button id="copy_steam_perm_link">Copy</button></div></div>
			<input id="steamid_textbox" style="display:none;" readonly data-select_type="all" value="https://steamcommunity.com/profiles/${profile.steamid}"></input>
			<div class="descriptor hidden">Created: <div id="account_creation_date"></div></div>
			<br>
		<div id='reputation_header' class="header hidden">Reputation</div>
		${storage.settingIsEnabled('reputation_scanner') ? '<div class="disclaimer hidden"></div>' : ''}
		<div class="header">Search</div>
		<div class="external_connection_container">
			<a href="https://rep.tf/${profile.steamid}" class="external_connection"><img src="https://rep.tf/favicon.ico" /><span>Rep</span></a>
			<a href="https://backpack.tf/profiles/${profile.steamid}" class="external_connection"><img src="https://backpack.tf/favicon.ico" /><span>Backpack</span></a>
			<a href="https://scrap.tf/profile/${profile.steamid}" class="external_connection"><img src="https://scrap.tf/favicon.ico" /><span>Scrap</span></a>
			<a href="https://bazaar.tf/profiles/${profile.steamid}" class="external_connection"><img src="https://bazaar.tf/favicon.ico" /><span>Bazaar</span></a>
			<a href="https://marketplace.tf/shop/${profile.steamid}" class="external_connection"><img src="https://marketplace.tf/favicon.ico" /><span>Marketplace</span></a>
			<a href="https://steamid.uk/profile/${profile.steamid}" class="external_connection"><img src="https://steamid.uk/favicon.ico" /><span>SteamID</span></a>
			<a href="https://steamtrades.com/user/${profile.steamid}" class="external_connection"><img src="https://cdn.steamtrades.com/img/favicon.ico" /><span>Steam Trades</span></a>
			<a href="https://duckduckgo.com/?q=%22${profile.steamid}%22" class="external_connection"><img src="https://duckduckgo.com/favicon.ico" /><span>DuckDuckGo</span></a>
		</div>
			</div>
	<br>`;
	},

	tradeWarning: (profile, warnings) => {
		let warning_html_list = '';
		for (warning of warnings) {
			warning_html_list += `<div class="warning">${warning}</div>`;
		}

		return `
		<div class="sap-tw-overlay" id="sap-trade-warning-overlay">
			<div class="container">
				<div class="title">Caution!</div>
				<div class="subtext">${profile.personaname} has the following warnings:</div>
				<br>
				${warning_html_list}
				<button id="confirm-trade-warning-overlay">Confirm</button>
			</div>	
		</div>`;
	},
	tradeImpersonatorWarning: (profile) => { }
};