// Build our database
storage.save_settings(true);
api.update.bots();
api.update.user_profiles();

chrome.runtime.sendMessage({ "icon_path": 'img/sap_good.png' });

/* ------------------------- Handle Navigation Tabs ------------------------- */
const navigation_tabs = qsa('.navigation a');
navigation_tabs.forEach((tab) => create_click_event(tab));

function create_click_event(selected_tab) {
	selected_tab.addEventListener(`click`, () => {
		// Hide all tabs and tab content
		navigation_tabs.forEach((tab) => {
			tab.classList.remove(`active`);	// Removes class "active" from all navigation tabs
			qs(`#content-${tab.dataset.content}`).classList.add(`hidden`);
		});

		// Show selected tab content
		selected_tab.classList.add(`active`);
		qs(`#content-${selected_tab.dataset.content}`).classList.remove(`hidden`);
		selected_tab.focus();
	});
}
