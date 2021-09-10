//  This file only exists to generate HTML data as strings and returns them. Do not preform any other actions here.

const html_elements = {
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
	myProfileToolbar: () => {
		return `<div id='sap-myProfile-toolbar' class='sap-myProfile-toolbar'>
			<div class='container'>
				<a id='save-user-profile-data'>
					<img src='${chrome.extension.getURL('img/icons/save-solid.svg')}'>
					<span>Save Profile Data</span>
				</a>
				<a id='load-user-profile-data'>
					<img src='${chrome.extension.getURL('img/icons/download-solid.svg')}'>
					<span>Load Profile Data</span>
				</a>
			</div>
		</div>`;
	}
};