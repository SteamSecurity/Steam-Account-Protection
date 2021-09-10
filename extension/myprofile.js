// This is for profile information recovery of the owners profile.
// This is *not* to be confused with profile.js which is for all profile and not the profiles edit page.

async function myProfile() {
	injectStylesheetToHead(`html/custom_styles/myprofiles.css`);
	injectStylesheetToHead(`html/custom_styles/overlay.css`);
	injectStylesheetToHead(`html/custom_styles/generic.css`);

	let user_profile_data = { personaname: null, real_name: null, custom_url: null, summary: null };

	user_profile_data.personaname = qs('[name="personaName"]').value;
	user_profile_data.real_name = qs('[name="real_name"]').value;
	user_profile_data.custom_url = qs('[name="customURL"]').value;
	user_profile_data.summary = qs('[name="summary"]').value;

	console.log(user_profile_data);

	qs('#application_root').insertAdjacentHTML('beforebegin', html_elements.myProfileToolbar(user_profile_data));
	qs('#save-user-profile-data').addEventListener('click', () => overlays.saveProfileData(user_profile_data));
	qs('#load-user-profile-data').addEventListener('click', () => overlays.loadProfileData(user_profile_data));
}