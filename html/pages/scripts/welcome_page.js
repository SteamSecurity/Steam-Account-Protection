// Functions to run when the page starts up
async function start() {
	await save_settings(true);
	api.update.bots();
	api.update.user_profiles();
}
start();
