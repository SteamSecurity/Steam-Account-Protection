const api = {
	filter: {
		profiles: () => {
			if (window.location.origin.includes(`chrome-extension://`)) return;

			sap_extension.data.user_profiles.steamrep_profiles.forEach((profile, index) => {
				if (time.current_time() >= profile.last_check + time.hours_to_milliseconds(1)) sap_extension.data.user_profiles.steamrep_profiles.splice(index, 1);
			});
			sap_extension.data.user_profiles.reptf_profiles.forEach((profile, index) => {
				if (time.current_time() >= profile.last_check + time.hours_to_milliseconds(1)) sap_extension.data.user_profiles.reptf_profiles.splice(index, 1);
			});
			storage.save_settings();
		}
	}
};
